import fs from "node:fs";
import { accountsConfigured, adminClient, currentMember } from "@/lib/account";
import { runCheck, who } from "@/lib/copycat/run.mjs";
import { judge, decide, small, MODEL, type Kase } from "@/lib/copycat/judge";
import { receiptPng } from "@/lib/copycat/receipt";
import { day, clock } from "@/lib/copycat/util.mjs";
import { ffmpeg, normalise } from "@/lib/copycat/media.mjs";

/**
 * POST /api/copycat/check   { links: [suspect, original?] }
 *
 * Copycat Detective on the page. Signed-in members only: the account is how
 * the tool knows who is asking, and the address stays with it (members). Each
 * account gets a few checks a day and the whole site a daily ceiling, because
 * every check asks a model to look at the pictures (AI Gateway, $5/month cap).
 *
 * Answers with newline-delimited JSON, one line per step, so the page can show
 * progress, then a final { done: true, ... } line with the result.
 *
 * The two links can come in either order: the dates decide which was first.
 * If the model can't be reached (the gateway refused, timed out, failed), the
 * check still ends with what the facts settle (judge.ts, decide with no
 * answer) and both pictures side by side, never a dead end. A check that
 * ends in an error doesn't count against the day's checks.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const PER_DAY = Number(process.env.COPYCAT_PER_DAY || 5);
const SITE_PER_DAY = Number(process.env.COPYCAT_SITE_PER_DAY || 400);

// Local testing without an account: development only, and only when switched on.
const devBypass = (request: Request) =>
  process.env.NODE_ENV === "development" && process.env.COPYCAT_DEV_BYPASS === "1" && request.headers.get("x-copycat-dev") === "1";

const json = (body: unknown, status = 200, cookies: string[] = []) => {
  const headers = new Headers({ "content-type": "application/json" });
  for (const c of cookies) headers.append("set-cookie", c);
  return new Response(JSON.stringify(body), { status, headers });
};

/** Two frames as small JPEG data URLs, or null if either can't be read. */
function picture(e: string, l: string) {
  const a = small(e), b = small(l);
  return a && b ? { earlier: `data:image/jpeg;base64,${a.toString("base64")}`, later: `data:image/jpeg;base64,${b.toString("base64")}` } : null;
}

/** GET: is the checker ready on this server (ffmpeg present, which model judges)? No secrets. */
export async function GET() {
  return json({ ok: !!ffmpeg(), ffmpeg: !!ffmpeg(), model: MODEL, perDay: PER_DAY });
}

export async function POST(request: Request) {
  let body: { links?: unknown };
  try { body = await request.json(); } catch { return json({ error: "bad-request" }, 400); }
  const links = (Array.isArray(body.links) ? body.links : []).map((l) => String(l ?? "").trim()).filter(Boolean).slice(0, 2);
  if (!links.length || links.some((l) => l.length > 600 || /\s/.test(l))) return json({ error: "bad-link" }, 400);

  const dev = devBypass(request);
  const { member, cookies } = dev ? { member: { id: "dev", email: "dev@localhost" }, cookies: [] } : await currentMember(request);
  if (!member) return json({ error: "sign-in" }, 401, cookies);

  // The daily limits, counted in the database so every server agrees.
  let rowId: number | null = null;
  if (!dev && accountsConfigured()) {
    const since = new Date(Date.now() - 864e5).toISOString();
    const db = adminClient();
    // Running (no verdict yet) or finished counts. One that ended in an error, or
    // that only asked for the other link, doesn't.
    const mine = await db.from("copycat_checks").select("id", { count: "exact", head: true }).eq("member_id", member.id).gte("created_at", since).or("verdict.is.null,verdict.not.in.(error,needs-original)");
    if ((mine.count ?? 0) >= PER_DAY) return json({ error: "limit", perDay: PER_DAY }, 429, cookies);
    const all = await db.from("copycat_checks").select("id", { count: "exact", head: true }).gte("created_at", since);
    if ((all.count ?? 0) >= SITE_PER_DAY) return json({ error: "busy" }, 503, cookies);
    const ins = await db.from("copycat_checks").insert({ member_id: member.id, inputs: links }).select("id").single();
    rowId = ins.data?.id ?? null;
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      let dir: string | null = null;
      let verdict = "error";
      try {
        const run = await runCheck({ links, suspectFirst: false }, (step: string) => send({ step }));
        dir = run.dir;
        if (run.error) { send({ done: true, error: "bad-link", message: run.error }); return; }
        if (run.needsOriginal) {
          const it = run.item;
          verdict = "needs-original";
          send({ done: true, needsOriginal: { who: who(it), when: it.when ? `${day(it.when.iso)}${it.when.precision === "exact" ? ` · ${clock(it.when.iso)}` : ""}` : null, text: String(it.text || it.title || "").slice(0, 220), url: it.url, quotes: it.quotes ?? null, quotesUrl: it.kind === "x" && it.quotes ? `${it.url}/quotes` : null, linkHandle: it.linkHandle ?? null } });
          return;
        }
        const k = run.kase as Kase;
        send({ step: "judge" });
        let answer = null;
        // Development only: a canned answer (or "none", as if the model were down), to test the page.
        const fake = dev ? request.headers.get("x-copycat-fake-judge") : null;
        try { answer = fake === "none" ? null : fake ? JSON.parse(fake) : await judge(k); } catch (err) {
          // Not a dead end: decide() answers from the facts alone.
          console.error("[copycat] judge failed, answering from the facts", MODEL, String((err as Error)?.message ?? err).slice(0, 300));
        }
        const d = decide(k, answer);
        verdict = d.verdict;
        let receipt: string | null = null;
        if (d.receipt) {
          send({ step: "receipt" });
          const png = await receiptPng(k, d);
          receipt = `data:image/png;base64,${png.toString("base64")}`;
          // As a JPEG it's about a third of the size, which keeps the whole answer
          // well under Vercel's 4.5 MB response limit. The PNG if that fails.
          try {
            fs.writeFileSync(/*turbopackIgnore: true*/ `${dir}/receipt.png`, png);
            const jpg = normalise(`${dir}/receipt.png`, `${dir}/receipt.jpg`, null, 2400);
            if (jpg) receipt = `data:image/jpeg;base64,${fs.readFileSync(/*turbopackIgnore: true*/ jpg).toString("base64")}`;
          } catch {}
        }
        const side = (it: Kase) => ({
          who: who(it),
          url: it.url,
          when: it.when ? (it.when.precision === "by" ? `by ${day(it.when.iso)}` : it.when.precision === "day" ? day(it.when.iso) : `${day(it.when.iso)} · ${clock(it.when.iso)}`) : null,
          avatar: it.avatar || it.icon || null,
          linkHandle: it.linkHandle || null,
        });
        send({
          done: true,
          verdict: d.verdict,
          headline: d.headline,
          why: d.why,
          gap: k.order?.known && !k.order.tie ? k.order.label : null,
          earlier: side(k.earlier),
          later: side(k.later),
          matches: d.matches,
          receipt,
          // No receipt: the two pictures side by side, so they can look for themselves.
          preview: receipt || !d.show ? null : picture(d.show.earlier.file, d.show.later.file),
          judged: !!answer,
          post: d.post,
          intent: d.intent,
        });
      } catch (err) {
        console.error("[copycat] check failed", err);
        send({ done: true, error: "failed" });
      } finally {
        if (dir) try { fs.rmSync(/*turbopackIgnore: true*/ dir, { recursive: true, force: true }); } catch {}
        if (rowId) try { await adminClient().from("copycat_checks").update({ verdict }).eq("id", rowId); } catch {}
        controller.close();
      }
    },
  });
  const headers = new Headers({ "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" });
  for (const c of cookies) headers.append("set-cookie", c);
  return new Response(stream, { headers });
}
