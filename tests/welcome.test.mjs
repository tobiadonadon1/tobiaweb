/**
 * THE WELCOME EMAIL A NEW MEMBER GETS (lib/membership/welcome.ts).
 *
 * Pins the promises: the member's name when there is one that reads as a
 * name and none when there isn't, the card inside the email, the plan's own
 * perks, and exactly one email per subscription however often Stripe calls.
 *
 *   npm test
 */
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";

process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop";
delete process.env.RESEND_API_KEY;
delete process.env.SHOP_FILE_KEY;

// The card's font comes from Google Fonts; offline it falls back, and fast.
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) =>
  String(url).includes("fonts.g") ? Promise.reject(new Error("offline")) : realFetch(url, init);

const { memberName, welcomeEmail, welcomeMember } = await import("../lib/membership/welcome.ts");

const ACCOUNT = "https://www.tobiadonadon.com/projects/construct/account";

test("the name: tidied when it reads as one, dropped when it doesn't", () => {
  assert.deepEqual(memberName("MARCO ROSSI"), { first: "Marco", full: "Marco Rossi" });
  assert.deepEqual(memberName("  jean-luc   o'neil "), { first: "Jean-Luc", full: "Jean-Luc O'Neil" });
  assert.deepEqual(memberName("Sofia de la Cruz"), { first: "Sofia", full: "Sofia de la Cruz" });
  assert.deepEqual(memberName("Zoë Ångström"), { first: "Zoë", full: "Zoë Ångström" });
  for (const bad of ["", null, undefined, "J0hn", "me@x.com", "Acme LLC", "Smith & Co", "<b>x</b>", "x".repeat(61)]) {
    assert.equal(memberName(bad), null, String(bad));
  }
});

test("the email: by name, the plan's own perks, Telegram first", () => {
  const m = welcomeEmail({ tier: "pro", name: memberName("marco rossi"), telegram: "https://t.me/example", account: ACCOUNT });
  assert.equal(m.subject, "Welcome to Pro, Marco.");
  assert.match(m.html, /Congratulations, <span[^>]*>Marco<\/span>\./);
  assert.match(m.html, /src="cid:member-card@construct"/);
  assert.match(m.html, /Masterclass/);
  assert.doesNotMatch(m.html, /1-on-1/);
  assert.match(m.html, /href="https:\/\/t\.me\/example"[^>]*>Message me on Telegram/);
  assert.match(m.text, /^Congratulations, Marco\./);
  assert.match(m.text, /Telegram: https:\/\/t\.me\/example/);

  const u = welcomeEmail({ tier: "ultimate", name: null, telegram: null, account: ACCOUNT });
  assert.equal(u.subject, "Welcome to Ultimate.");
  assert.match(u.html, /Congratulations\./);
  assert.match(u.html, /1-on-1 call/);
  assert.doesNotMatch(u.html, /Message me on Telegram/);
  assert.match(u.html, /Open your membership/);
});

/* ---- the send, once ---- */

const SUB = "sub_test_welcome";
const SESSION = "cs_test_welcome000000";

beforeEach(() => {
  globalThis.__mail = [];
  globalThis.__mailDown = false;
  globalThis.__stripe = {
    sessions: new Map(),
    paymentIntents: new Map(),
    subscriptions: new Map(),
    products: new Set(),
    createdSessions: [],
    createdProducts: [],
  };
  globalThis.__stripe.subscriptions.set(SUB, {
    id: SUB,
    object: "subscription",
    status: "active",
    start_date: Date.UTC(2026, 9, 26) / 1000,
    metadata: { member: "m_1", tier: "pro" },
    items: { data: [{ price: { id: "price_pro", lookup_key: "construct_pro_monthly", metadata: {} } }] },
  });
  globalThis.__stripe.sessions.set(SESSION, {
    id: SESSION,
    object: "checkout.session",
    mode: "subscription",
    status: "complete",
    payment_status: "paid",
    livemode: false,
    subscription: SUB,
    customer_details: { email: "marco@example.com", name: "MARCO ROSSI" },
  });
});

test("a new member is welcomed once, with their card attached inline", async () => {
  const first = await welcomeMember(SESSION, "http://localhost:3000");
  assert.equal(first.status, "sent");
  assert.equal(globalThis.__mail.length, 1);
  const { message } = globalThis.__mail[0];
  assert.equal(message.to, "marco@example.com");
  assert.equal(message.subject, "Welcome to Pro, Marco.");
  assert.equal(message.attachments[0].cid, "member-card@construct");
  assert.equal(message.attachments[0].content.subarray(1, 4).toString(), "PNG");
  // A test checkout links back to the server that handled it.
  assert.match(message.html, /http:\/\/localhost:3000\/projects\/construct\/account/);
  assert.ok(globalThis.__stripe.subscriptions.get(SUB).metadata.welcomed_at);

  const again = await welcomeMember(SESSION, "http://localhost:3000");
  assert.equal(again.status, "already-sent");
  assert.equal(globalThis.__mail.length, 1);
});

test("a failed send throws and stamps nothing, so Stripe's retry sends it", async () => {
  globalThis.__mailDown = true;
  await assert.rejects(welcomeMember(SESSION, "http://localhost:3000"));
  assert.equal(globalThis.__stripe.subscriptions.get(SUB).metadata.welcomed_at, undefined);
  globalThis.__mailDown = false;
  assert.equal((await welcomeMember(SESSION, "http://localhost:3000")).status, "sent");
});

test("nothing for an unpaid checkout or a subscription that isn't a membership", async () => {
  globalThis.__stripe.sessions.get(SESSION).payment_status = "unpaid";
  assert.equal((await welcomeMember(SESSION, "http://localhost:3000")).status, "not-paid");
  globalThis.__stripe.subscriptions.get(SUB).items.data[0].price = { id: "price_x", lookup_key: "other", metadata: {} };
  assert.equal((await welcomeMember(SESSION, "http://localhost:3000")).status, "not-ours");
  assert.equal(globalThis.__mail.length, 0);
});
