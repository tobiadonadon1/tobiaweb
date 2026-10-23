/**
 * PUT A LESSON, A TEMPLATE OR A TRAINING VIDEO IN THE MEMBERS' DASHBOARD.
 *
 *   node scripts/shelf-add.mjs <masterclass|design|training> <pro|ultimate> "<title>" <url> ["<one line about it>"]
 *
 * pro       open to Pro and Ultimate
 * ultimate  Ultimate only: Pro sees it in the list, locked, with the way up
 *
 * The url is where it lives (an unlisted YouTube or Vimeo video, a Drive
 * folder, a Figma file, a zip). It is only ever handed to a member whose
 * plan reaches it (/api/membership/perks). Masterclass and training are
 * videos, Design is templates; a title that already exists is updated, so
 * fixing a link is the same command again. New items go to the bottom.
 *
 *   node scripts/shelf-add.mjs list           everything, in order
 *   node scripts/shelf-add.mjs remove <id>    hides one (published = false)
 *
 * Reads ACCOUNTS_SUPABASE_URL and ACCOUNTS_SUPABASE_SECRET_KEY from
 * .env.local. Needs the migration 20261022120000_grants_and_shelves.sql.
 */
process.loadEnvFile(".env.local");

const url = process.env.ACCOUNTS_SUPABASE_URL;
const key = process.env.ACCOUNTS_SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("ACCOUNTS_SUPABASE_URL / ACCOUNTS_SUPABASE_SECRET_KEY are not in .env.local");
  process.exit(1);
}

const rest = (path, init = {}) =>
  fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json", ...init.headers },
  }).then(async (res) => {
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      console.error(`failed (${res.status}):`, body?.message ?? body);
      if (/shelf|template/.test(body?.message ?? "")) console.error("Apply supabase/migrations/20261022120000_grants_and_shelves.sql first.");
      process.exit(1);
    }
    return body;
  });

const [cmd, ...rest_] = process.argv.slice(2);

if (cmd === "list") {
  const rows = await rest("training?select=id,shelf,tier,title,url,published&order=shelf,sort");
  if (!rows.length) console.log("Nothing yet.");
  for (const r of rows) console.log(`${r.published ? " " : "×"} ${r.shelf.padEnd(11)} ${r.tier.padEnd(8)} ${r.id}  ${r.url}`);
  process.exit(0);
}

if (cmd === "remove") {
  const [id] = rest_;
  if (!id) {
    console.error("usage: node scripts/shelf-add.mjs remove <id>   (ids from: node scripts/shelf-add.mjs list)");
    process.exit(1);
  }
  const rows = await rest(`training?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { prefer: "return=representation" },
    body: JSON.stringify({ published: false }),
  });
  console.log(rows.length ? `${id}: hidden` : `No item called ${id}.`);
  process.exit(0);
}

const SHELVES = { masterclass: "video", design: "template", training: "video" };
const [shelf, tier, title, link, summary] = [cmd, ...rest_];
if (!(shelf in SHELVES) || !["pro", "ultimate"].includes(tier) || !title || !/^https?:\/\//.test(link ?? "")) {
  console.error('usage: node scripts/shelf-add.mjs <masterclass|design|training> <pro|ultimate> "<title>" <url> ["<one line about it>"]');
  process.exit(1);
}

const id = `${shelf}-${title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`.slice(0, 80);
const row = {
  id,
  shelf,
  tier,
  title: title.trim(),
  url: link,
  summary: summary?.trim() || null,
  kind: SHELVES[shelf],
  published: true,
  // Seconds since 2026: new items land after the old ones.
  sort: Math.floor((Date.now() - Date.UTC(2026, 0, 1)) / 1000),
};
// Already there: update it in place, keeping its spot in the list.
const [had] = await rest(`training?id=eq.${encodeURIComponent(id)}&select=id`);
const { sort, ...change } = row;
const [saved] = had
  ? await rest(`training?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify(change) })
  : await rest("training", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify({ ...row, sort }) });
console.log(`${saved.id}: in ${shelf}, ${tier === "pro" ? "open to Pro and Ultimate" : "Ultimate only (locked for Pro)"}`);
