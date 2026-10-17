/**
 * THE NEWSLETTER BOX, SERVER SIDE (lib/newsletter.ts), against a stand-in
 * for the Supabase client that records every call.
 *
 *   npm test
 */
import test from "node:test";
import assert from "node:assert/strict";

const { subscribe, setMailing, isSubscribed } = await import("../lib/newsletter.ts");

/** A Supabase-shaped stand-in: from(table).update/upsert/select…, with canned answers. */
function fakeDb({ members = new Map(), fail = new Set() } = {}) {
  const calls = [];
  const list = new Map();
  const from = (table) => {
    const q = { table };
    const done = () => {
      calls.push(q);
      if (fail.has(table)) return { data: null, error: { message: `relation "public.${table}" does not exist` } };
      if (q.op === "update" && table === "members") {
        const m = members.get(q.eq);
        if (m) Object.assign(m, q.values);
        return { data: null, error: null };
      }
      if (q.op === "upsert") {
        if (!(q.opts.ignoreDuplicates && list.has(q.values.email))) list.set(q.values.email, q.values);
        return { data: null, error: null };
      }
      if (q.op === "select") return { data: members.get(q.eq) ?? null, error: null };
      return { data: null, error: null };
    };
    return {
      update(values) { Object.assign(q, { op: "update", values }); return { eq: (_c, v) => { q.eq = v; return Promise.resolve(done()); } }; },
      upsert(values, opts) { Object.assign(q, { op: "upsert", values, opts }); return Promise.resolve(done()); },
      select() { q.op = "select"; return { eq: (_c, v) => { q.eq = v; return { maybeSingle: () => Promise.resolve(done()) }; } }; },
    };
  };
  return { db: { from }, calls, list, members };
}

test("newsletter: a tick puts the address on the list once, lowercased, and sets an account's flag", async () => {
  const f = fakeDb({ members: new Map([["ada@example.com", { mailing: false }]]) });
  assert.equal(await subscribe("  Ada@Example.com ", "viral-machine", f.db), true);
  assert.equal(f.members.get("ada@example.com").mailing, true);
  assert.deepEqual(f.list.get("ada@example.com"), { email: "ada@example.com", source: "viral-machine" });
  // A second tick elsewhere keeps the first time and place.
  await subscribe("ada@example.com", "signin", f.db);
  assert.equal(f.list.get("ada@example.com").source, "viral-machine");
  assert.equal(f.list.size, 1);
});

test("newsletter: an address with no account still lands on the list", async () => {
  const f = fakeDb();
  assert.equal(await subscribe("grace@example.com", "launchr", f.db), true);
  assert.ok(f.list.has("grace@example.com"));
});

test("newsletter: before the table exists a tick is logged, never thrown, and the account flag is still set", async () => {
  const f = fakeDb({ members: new Map([["ada@example.com", { mailing: false }]]), fail: new Set(["newsletter"]) });
  const errors = [];
  const real = console.error;
  console.error = (...a) => errors.push(a.join(" "));
  try {
    assert.equal(await subscribe("ada@example.com", "signup", f.db), false);
  } finally {
    console.error = real;
  }
  assert.equal(f.members.get("ada@example.com").mailing, true);
  assert.ok(errors.some((e) => e.includes("[newsletter]")));
});

test("newsletter: sign-up writes the box's answer either way, never a default", async () => {
  const f = fakeDb({ members: new Map([["new@example.com", { mailing: true }], ["yes@example.com", { mailing: false }]]) });
  await setMailing("new@example.com", false, "signup", f.db);
  assert.equal(f.members.get("new@example.com").mailing, false, "unticked: off the list, whatever the column's default");
  assert.ok(!f.list.has("new@example.com"));
  await setMailing("yes@example.com", true, "signup", f.db);
  assert.equal(f.members.get("yes@example.com").mailing, true);
  assert.equal(f.list.get("yes@example.com").source, "signup");
});

test("newsletter: the sign-in nudge asks only accounts that aren't subscribed, and a hiccup never nags", async () => {
  const f = fakeDb({ members: new Map([["in@example.com", { mailing: true }], ["out@example.com", { mailing: false }]]) });
  assert.equal(await isSubscribed("In@Example.com", f.db), true);
  assert.equal(await isSubscribed("out@example.com", f.db), false);
  const broken = fakeDb({ fail: new Set(["members"]) });
  const real = console.error;
  console.error = () => {};
  try {
    assert.equal(await isSubscribed("out@example.com", broken.db), true);
  } finally {
    console.error = real;
  }
});

test("newsletter: without accounts configured it does nothing and says so", async () => {
  assert.equal(await subscribe("ada@example.com", "launchr"), false);
  assert.equal(await isSubscribed("ada@example.com"), true);
});

test("newsletter: the skills-shelf popup's tick reaches the waitlist row, and only a real tick", async () => {
  const { mkdtempSync, readFileSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const file = path.join(mkdtempSync(path.join(tmpdir(), "waitlist-")), "w.ndjson");
  process.env.WAITLIST_FILE = file;
  delete process.env.WAITLIST_WEBHOOK_URL;
  const { POST } = await import("../app/api/waitlist/route.ts");
  const send = (body) =>
    POST(new Request("http://localhost/api/waitlist", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } }));
  const real = console.info;
  console.info = () => {};
  try {
    const base = { source: "superhuman", interest: "material" };
    assert.equal((await send({ ...base, email: "yes@example.com", newsletter: true, item: "App Designer!" })).status, 200);
    assert.equal((await send({ ...base, email: "no@example.com" })).status, 200);
    assert.equal((await send({ ...base, email: "str@example.com", newsletter: "true", item: "x" })).status, 200);
  } finally {
    console.info = real;
    delete process.env.WAITLIST_FILE;
  }
  const rows = readFileSync(file, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  assert.equal(rows[0].newsletter, true);
  assert.equal(rows[0].item, "app-designer");
  assert.equal(rows[1].newsletter, undefined);
  assert.equal(rows[2].newsletter, undefined, "only a boolean true is a tick");
  assert.equal(rows[2].item, undefined);
});
