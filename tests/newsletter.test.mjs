/**
 * THE NEWSLETTER BOX, SERVER SIDE (lib/newsletter.ts), against a stand-in
 * for the Supabase client that records every call.
 *
 *   npm test
 */
import test from "node:test";
import assert from "node:assert/strict";

const { subscribe, setMailing, isSubscribed, markUnsubscribed, syncOwed, MAX_ATTEMPTS } = await import("../lib/newsletter.ts");
const { verifyWebhook, addSubscriber } = await import("../lib/beehiiv.ts");

/**
 * A Supabase-shaped stand-in: tables in memory, the few query shapes
 * lib/newsletter.ts uses (select/eq/is/lt/order/limit/maybeSingle, update/eq,
 * upsert), and tables that can be made to fail.
 */
function fakeDb({ members = new Map(), rows = [], fail = new Set() } = {}) {
  const list = new Map(rows.map((r) => [r.email, { status: "subscribed", synced_at: null, sync_attempts: 0, campaign: null, ...r }]));
  const tables = { members, newsletter: list };
  const from = (table) => {
    const failed = () => ({ data: null, error: { message: `relation "public.${table}" does not exist` } });
    const filters = [];
    const match = (r) => filters.every(([op, c, v]) => (op === "eq" ? r[c] === v : op === "is" ? r[c] === v : r[c] < v));
    const rowsOf = () => [...tables[table].entries()].map(([email, r]) => ({ email, ...r }));
    const select = {
      eq(c, v) { filters.push(["eq", c, v]); return select; },
      is(c, v) { filters.push(["is", c, v]); return select; },
      lt(c, v) { filters.push(["lt", c, v]); return select; },
      order() { return select; },
      limit(n) { return Promise.resolve(fail.has(table) ? failed() : { data: rowsOf().filter(match).slice(0, n), error: null }); },
      maybeSingle() { return Promise.resolve(fail.has(table) ? failed() : { data: rowsOf().filter(match)[0] ?? null, error: null }); },
    };
    return {
      select: () => select,
      update(values) {
        return { eq: (c, v) => {
          if (fail.has(table)) return Promise.resolve(failed());
          for (const [k, r] of tables[table]) if ((c === "email" ? k : r[c]) === v) Object.assign(r, values);
          return Promise.resolve({ data: null, error: null });
        } };
      },
      upsert(values, opts = {}) {
        if (fail.has(table)) return Promise.resolve(failed());
        const { email, ...rest } = values;
        const had = tables[table].get(email);
        if (!(had && opts.ignoreDuplicates)) tables[table].set(email, { status: "subscribed", synced_at: null, sync_attempts: 0, ...(had ?? {}), ...rest });
        return Promise.resolve({ data: null, error: null });
      },
    };
  };
  return { db: { from }, list, members };
}

/** beehiiv, standing in: records each address it is sent and answers as told. */
function fakeBeehiiv(answer = () => ({ ok: true, id: "sub_1", status: "active" })) {
  const sent = [];
  return { sent, push: async (email, campaign) => { sent.push({ email, campaign }); return answer(email); } };
}

const quiet = async (fn) => {
  const [e, i] = [console.error, console.info];
  const logs = [];
  console.error = console.info = (...a) => logs.push(a.join(" "));
  try { return { value: await fn(), logs }; } finally { console.error = e; console.info = i; }
};

test("newsletter: a tick records consent once, lowercased, flags the account and reaches beehiiv once", async () => {
  const f = fakeDb({ members: new Map([["ada@example.com", { mailing: false }]]) });
  const b = fakeBeehiiv();
  assert.equal(await subscribe("  Ada@Example.com ", "free_skill", "viral-machine", { db: f.db, push: b.push }), "subscribed");
  const row = f.list.get("ada@example.com");
  assert.equal(row.source, "viral-machine");
  assert.equal(row.campaign, "free_skill");
  assert.equal(row.beehiiv_id, "sub_1");
  assert.ok(row.synced_at);
  assert.equal(f.members.get("ada@example.com").mailing, true);
  assert.deepEqual(b.sent, [{ email: "ada@example.com", campaign: "free_skill" }]);
  // A second tick elsewhere: same row, first place kept, beehiiv not asked again.
  assert.equal(await subscribe("ada@example.com", "login_prompt", "signin", { db: f.db, push: b.push }), "subscribed");
  assert.equal(f.list.get("ada@example.com").source, "viral-machine");
  assert.equal(f.list.size, 1);
  assert.equal(b.sent.length, 1, "no duplicate subscription");
});

test("newsletter: beehiiv down keeps the consent, owes it, and the sweep sends it later", async () => {
  const f = fakeDb();
  const down = fakeBeehiiv(() => ({ ok: false, error: "network: TimeoutError", retry: true }));
  const r = await quiet(() => subscribe("grace@example.com", "account_signup", "signup", { db: f.db, push: down.push }));
  assert.equal(r.value, "pending");
  const row = f.list.get("grace@example.com");
  assert.equal(row.status, "subscribed");
  assert.equal(row.synced_at, null);
  assert.equal(row.sync_attempts, 1);
  assert.match(row.sync_error, /Timeout/);
  const up = fakeBeehiiv();
  const swept = await syncOwed(50, { db: f.db, push: up.push });
  assert.deepEqual(swept, { tried: 1, sent: 1, unsubscribed: 0, failed: 0 });
  assert.equal(up.sent[0].campaign, "account_signup", "the campaign of the original box");
  assert.ok(f.list.get("grace@example.com").synced_at);
  assert.equal((await syncOwed(50, { db: f.db, push: up.push })).tried, 0, "nothing owed twice");
});

test("newsletter: an address beehiiv rejects for good is not retried forever", async () => {
  const f = fakeDb();
  const bad = fakeBeehiiv(() => ({ ok: false, error: "400 Invalid email", retry: false }));
  await quiet(() => subscribe("typo@example", "free_skill", "launchr", { db: f.db, push: bad.push }));
  assert.ok(f.list.get("typo@example").sync_attempts >= MAX_ATTEMPTS);
  assert.equal((await syncOwed(50, { db: f.db, push: bad.push })).tried, 0);
});

test("newsletter: an unsubscribed address is never reactivated, by a tick or by beehiiv", async () => {
  const f = fakeDb({ members: new Map([["left@example.com", { mailing: true }]]), rows: [{ email: "left@example.com", synced_at: "2026-10-01" }] });
  const b = fakeBeehiiv();
  assert.equal(await markUnsubscribed("Left@Example.com", "sub_9", { db: f.db }), true);
  assert.equal(f.list.get("left@example.com").status, "unsubscribed");
  assert.equal(f.members.get("left@example.com").mailing, false);
  const r = await quiet(() => subscribe("left@example.com", "free_skill", "launchr", { db: f.db, push: b.push }));
  assert.equal(r.value, "unsubscribed");
  assert.equal(b.sent.length, 0, "beehiiv is not even asked");
  assert.equal(f.members.get("left@example.com").mailing, false);
  // beehiiv already had someone as unsubscribed (they left before this site knew): recorded, not reactivated.
  const g = fakeDb();
  const gone = fakeBeehiiv(() => ({ ok: true, id: "sub_2", status: "inactive" }));
  const s = await quiet(() => subscribe("old@example.com", "login_prompt", "signin", { db: g.db, push: gone.push }));
  assert.equal(s.value, "unsubscribed");
  assert.equal(g.list.get("old@example.com").status, "unsubscribed");
});

test("newsletter: an unsubscribe for an address the site never had is recorded, so it is never added", async () => {
  const f = fakeDb();
  assert.equal(await markUnsubscribed("stranger@example.com", null, { db: f.db }), true);
  assert.equal(f.list.get("stranger@example.com").status, "unsubscribed");
  assert.equal(f.list.get("stranger@example.com").source, "beehiiv");
});

test("newsletter: without the table a tick is logged, never thrown", async () => {
  const f = fakeDb({ members: new Map([["ada@example.com", { mailing: false }]]), fail: new Set(["newsletter"]) });
  const b = fakeBeehiiv();
  const r = await quiet(() => subscribe("ada@example.com", "account_signup", "signup", { db: f.db, push: b.push }));
  assert.equal(r.value, "failed");
  assert.ok(r.logs.some((e) => e.includes("[newsletter]")));
});

test("newsletter: sign-up writes the box's answer either way, never a default", async () => {
  const f = fakeDb({ members: new Map([["new@example.com", { mailing: true }], ["yes@example.com", { mailing: false }]]) });
  const b = fakeBeehiiv();
  await setMailing("new@example.com", false, "account_signup", "signup", { db: f.db, push: b.push });
  assert.equal(f.members.get("new@example.com").mailing, false, "unticked: off the list, whatever the column's default");
  assert.ok(!f.list.has("new@example.com"));
  await setMailing("yes@example.com", true, "account_signup", "signup", { db: f.db, push: b.push });
  assert.equal(f.members.get("yes@example.com").mailing, true);
  assert.equal(f.list.get("yes@example.com").campaign, "account_signup");
  assert.deepEqual(b.sent.map((x) => x.email), ["yes@example.com"], "an empty box never reaches beehiiv");
});

test("newsletter: the box is shown until the address has answered, and a hiccup never nags", async () => {
  const f = fakeDb({ rows: [{ email: "in@example.com" }, { email: "out@example.com", status: "unsubscribed" }] });
  assert.equal(await isSubscribed("In@Example.com", { db: f.db }), true);
  assert.equal(await isSubscribed("out@example.com", { db: f.db }), true, "unsubscribed: not asked again");
  assert.equal(await isSubscribed("new@example.com", { db: f.db }), false);
  const broken = fakeDb({ fail: new Set(["newsletter"]) });
  assert.equal((await quiet(() => isSubscribed("new@example.com", { db: broken.db }))).value, true);
});

test("newsletter: without accounts configured it does nothing and says so", async () => {
  assert.equal(await subscribe("ada@example.com", "free_skill", "launchr"), "failed");
  assert.equal(await isSubscribed("ada@example.com"), true);
});

test("beehiiv: the request matches the spec, and the key never leaves the header", async () => {
  process.env.BEEHIIV_API_KEY = "test-key";
  process.env.BEEHIIV_PUBLICATION_ID = "pub_test";
  try {
    let seen;
    const ok = await addSubscriber("ada@example.com", "login_prompt", async (url, init) => {
      seen = { url, init };
      return new Response(JSON.stringify({ data: { id: "sub_x", status: "validating" } }), { status: 201 });
    });
    assert.deepEqual(ok, { ok: true, id: "sub_x", status: "validating" });
    assert.equal(seen.url, "https://api.beehiiv.com/v2/publications/pub_test/subscriptions");
    assert.equal(seen.init.headers.authorization, "Bearer test-key");
    assert.deepEqual(JSON.parse(seen.init.body), {
      email: "ada@example.com", reactivate_existing: false, send_welcome_email: true,
      utm_source: "tobia_website", utm_medium: "website", utm_campaign: "login_prompt",
    });
    const limited = await addSubscriber("a@b.co", "free_skill", async () => new Response(JSON.stringify({ errors: [{ message: "Too many" }] }), { status: 429 }));
    assert.equal(limited.ok, false);
    assert.equal(limited.retry, true);
    const invalid = await addSubscriber("a@b.co", "free_skill", async () => new Response("{}", { status: 400 }));
    assert.equal(invalid.retry, false);
    const offline = await addSubscriber("a@b.co", "free_skill", async () => { throw new TypeError("fetch failed"); });
    assert.equal(offline.ok, false);
    assert.equal(offline.retry, true);
  } finally {
    delete process.env.BEEHIIV_API_KEY;
    delete process.env.BEEHIIV_PUBLICATION_ID;
  }
  assert.equal((await addSubscriber("a@b.co", "free_skill", async () => assert.fail("called"))).error, "not-configured");
});

// Svix's own published example (docs.svix.com, "Verifying webhooks manually").
const SVIX = {
  secret: "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw",
  id: "msg_p5jXN8AQM9LWM0D4loKWxJek",
  timestamp: "1614265330",
  body: '{"test": 2432232314}',
  signature: "v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=",
};

test("beehiiv webhook: Svix signatures are checked against the raw body, in time", () => {
  const h = { id: SVIX.id, timestamp: SVIX.timestamp, signature: SVIX.signature };
  const at = Number(SVIX.timestamp);
  assert.equal(verifyWebhook(SVIX.body, h, SVIX.secret, at), true);
  assert.equal(verifyWebhook(SVIX.body, { ...h, signature: `v1,bm9wZQ== ${SVIX.signature}` }, SVIX.secret, at), true, "one of several");
  assert.equal(verifyWebhook(SVIX.body + " ", h, SVIX.secret, at), false, "body changed");
  assert.equal(verifyWebhook(SVIX.body, { ...h, id: "msg_other" }, SVIX.secret, at), false, "id changed");
  assert.equal(verifyWebhook(SVIX.body, h, "whsec_" + Buffer.from("another secret").toString("base64"), at), false, "wrong secret");
  assert.equal(verifyWebhook(SVIX.body, h, SVIX.secret, at + 301), false, "replayed later");
  assert.equal(verifyWebhook(SVIX.body, h, SVIX.secret, at - 301), false, "from the future");
  assert.equal(verifyWebhook(SVIX.body, { ...h, signature: null }, SVIX.secret, at), false);
  assert.equal(verifyWebhook(SVIX.body, h, "", at), false, "no secret, no entry");
});

test("beehiiv webhook route: refuses without the secret or a valid signature, ignores other events", async () => {
  const { createHmac } = await import("node:crypto");
  const { POST } = await import("../app/api/newsletter/beehiiv/route.ts");
  const secret = "whsec_" + Buffer.from("a test secret for the route").toString("base64");
  const sign = (body, id = "msg_1", ts = String(Math.floor(Date.now() / 1000))) => ({
    "svix-id": id, "svix-timestamp": ts,
    "svix-signature": "v1," + createHmac("sha256", Buffer.from(secret.slice(6), "base64")).update(`${id}.${ts}.${body}`).digest("base64"),
  });
  const call = (body, headers) => POST(new Request("http://localhost/api/newsletter/beehiiv", { method: "POST", body, headers }));
  const del = JSON.stringify({ event_type: "subscription.deleted", data: { email: "Left@Example.com", id: "sub_1" } });
  const r0 = await quiet(() => call(del, sign(del)));
  assert.equal(r0.value.status, 503, "no secret configured: refused, beehiiv retries");
  process.env.BEEHIIV_WEBHOOK_SECRET = secret;
  try {
    assert.equal((await call(del, { ...sign(del), "svix-signature": "v1,AAAA" })).status, 401);
    assert.equal((await call(del, {})).status, 401);
    const other = JSON.stringify({ event_type: "post.sent", data: {} });
    const r = await call(other, sign(other));
    assert.equal(r.status, 200);
    assert.equal((await r.json()).ignored, "post.sent");
    // Valid, but no database here: answered 500 so beehiiv sends it again.
    assert.equal((await quiet(() => call(del, sign(del)))).value.status, 500);
  } finally {
    delete process.env.BEEHIIV_WEBHOOK_SECRET;
  }
});

test("newsletter sync route: only Vercel's cron, with the secret, can run it", async () => {
  const { GET } = await import("../app/api/newsletter/sync/route.ts");
  const call = (auth) => GET(new Request("http://localhost/api/newsletter/sync", { headers: auth ? { authorization: auth } : {} }));
  assert.equal((await call()).status, 401, "no secret set: closed");
  process.env.CRON_SECRET = "cron-test";
  try {
    assert.equal((await call()).status, 401);
    assert.equal((await call("Bearer wrong-one")).status, 401);
    assert.equal((await call("Bearer cron-test")).status, 503, "authorized, but beehiiv isn't configured here");
  } finally {
    delete process.env.CRON_SECRET;
  }
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
