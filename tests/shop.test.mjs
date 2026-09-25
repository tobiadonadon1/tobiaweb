/**
 * THE SHOP, END TO END, WITHOUT A NETWORK.
 *
 * Runs the real route handlers against an in-memory Stripe account
 * (tests/support/stripe-mock.mjs, which keeps Stripe's genuine webhook
 * signing) and a stand-in Gmail. Every path money can take is here:
 * a signed webhook delivering a paid purchase, the same webhook arriving
 * twice, a bank still processing, the email provider failing, a forged
 * request, a download with and without payment, and checkout with Stripe
 * up, down, and meeting the product for the first time.
 *
 *   npm test
 */
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import Stripe from "stripe";

/* ---- environment: a configured shop, and a fake product file ---- */
process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
process.env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop";
process.env.RESEND_API_KEY = "re_test_key";
delete process.env.VERCEL_ENV;

const { newKey, parseKey, seal, unseal } = await import("../lib/shop/seal.ts");
const fileKey = newKey();
process.env.SHOP_FILE_KEY = fileKey;
const ZIP = Buffer.from("PK\u0003\u0004 not really a zip, but the bytes have to survive " + "x".repeat(4096));
const cwd = mkdtempSync(path.join(tmpdir(), "shop-test-"));
mkdirSync(path.join(cwd, "private"));
writeFileSync(path.join(cwd, "private", "the-98c-trade.zip.enc"), seal(ZIP, parseKey(fileKey)));
const LAUNCHR_ZIP = Buffer.from("PK\u0003\u0004 the launch-video skill, a different file " + "z".repeat(3000));
writeFileSync(path.join(cwd, "private", "launchr.zip.enc"), seal(LAUNCHR_ZIP, parseKey(fileKey)));
process.chdir(cwd);

/* ---- email: Gmail is recorded by the nodemailer mock; Resend, the
        fallback, by this stub ---- */
const resendCalls = [];
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  if (String(url) === "https://api.resend.com/emails") {
    resendCalls.push({ body: JSON.parse(init.body), headers: init.headers });
    return Response.json({ id: `email_${resendCalls.length}` });
  }
  return realFetch(url, init);
};
const mail = () => (globalThis.__mail ??= []);

const { POST: webhook } = await import("../app/api/stripe/webhook/route.ts");
const { GET: download } = await import("../app/api/download/route.ts");
const { POST: checkout } = await import("../app/api/checkout/route.ts");
const { GET: health } = await import("../app/api/shop/health/route.ts");
const { THE_98C_TRADE, LAUNCHR, productById } = await import("../lib/shop/products.ts");

const ORIGIN = "http://localhost:3000";
const signer = new Stripe("sk_test_mock").webhooks;

beforeEach(() => {
  globalThis.__stripe = {
    sessions: new Map(),
    paymentIntents: new Map(),
    products: new Set(),
    createdSessions: [],
    createdProducts: [],
  };
  globalThis.__mail = [];
  globalThis.__mailDown = false;
  globalThis.__mailRefusesZips = false;
  resendCalls.length = 0;
});

let n = 0;
function purchase({ paid = true, product = "the-98c-trade", email = "buyer@example.com", name = "Ada Lovelace", status = "complete" } = {}) {
  const id = `cs_test_session${String(++n).padStart(8, "0")}`;
  const pi = `pi_${id}`;
  globalThis.__stripe.paymentIntents.set(pi, { id: pi, object: "payment_intent", metadata: {} });
  globalThis.__stripe.sessions.set(id, {
    id,
    object: "checkout.session",
    status,
    payment_status: paid ? "paid" : "unpaid",
    metadata: { product },
    customer_details: { email, name },
    payment_intent: pi,
  });
  return id;
}

function signedEvent(sessionId, { type = "checkout.session.completed", secret = process.env.STRIPE_WEBHOOK_SECRET } = {}) {
  const payload = JSON.stringify({
    id: `evt_${sessionId}`,
    object: "event",
    type,
    data: { object: { id: sessionId, object: "checkout.session" } },
  });
  return new Request(`${ORIGIN}/api/stripe/webhook`, {
    method: "POST",
    body: payload,
    headers: { "stripe-signature": signer.generateTestHeaderString({ payload, secret }) },
  });
}

const stamp = (sessionId) =>
  globalThis.__stripe.paymentIntents.get(`pi_${sessionId}`).metadata.delivered_at;

/* ================================================================== *
 * The sealed file
 * ================================================================== */

test("a sealed file opens with its key and nothing else", () => {
  const key = parseKey(newKey());
  const sealed = seal(ZIP, key);
  assert.deepEqual(unseal(sealed, key), ZIP);
  assert.throws(() => unseal(sealed, parseKey(newKey())));
  const tampered = Buffer.from(sealed);
  tampered[tampered.length - 1] ^= 1;
  assert.throws(() => unseal(tampered, key), "a single flipped byte is refused");
  assert.throws(() => parseKey("too-short"));
});

test("the product, its page and its folder entry agree", async () => {
  const { entryHref, FOLDER_BY_ID } = await import("../components/superhuman/material/material-data.ts");
  assert.equal(THE_98C_TRADE.href, entryHref("setups", "the-98c-trade"));
  assert.equal(FOLDER_BY_ID.setups.entries.find((e) => e.slug === "the-98c-trade")?.product, "the-98c-trade");
  assert.equal(THE_98C_TRADE.priceCents, 500);
  assert.equal(THE_98C_TRADE.priceLabel, "€5");
  assert.equal(THE_98C_TRADE.currency, "eur");
  // Motion Director is free: a download, never a product.
  const md = FOLDER_BY_ID.skills.entries.find((e) => e.slug === "motion-director");
  assert.equal(md?.product, undefined);
  assert.equal(md?.link?.download, true);
  assert.equal(productById("motion-director"), undefined);
  // Launchr: a setup, sold, on the Stripe product Tobia made, at €12.
  assert.equal(LAUNCHR.href, entryHref("setups", "launchr"));
  assert.equal(FOLDER_BY_ID.setups.entries.find((e) => e.slug === "launchr")?.product, "launchr");
  assert.deepEqual(FOLDER_BY_ID.setups.entries.map((e) => e.slug), ["the-98c-trade", "launchr"], "Launchr sits below the 98¢ Trade");
  assert.equal(LAUNCHR.priceCents, 1200);
  assert.equal(LAUNCHR.priceLabel, "€12");
  assert.equal(LAUNCHR.stripeProductId, "prod_VKL1qwlByvTm4z");
  assert.equal(productById("__proto__"), undefined);
  assert.equal(productById("nope"), undefined);
});

/* ================================================================== *
 * The webhook
 * ================================================================== */

test("webhook: unsigned and forged requests are refused, nothing is sent", async () => {
  const id = purchase();
  const unsigned = await webhook(new Request(`${ORIGIN}/api/stripe/webhook`, { method: "POST", body: "{}" }));
  assert.equal(unsigned.status, 400);
  const forged = await webhook(signedEvent(id, { secret: "whsec_someone_else" }));
  assert.equal(forged.status, 400);
  assert.equal(mail().length, 0);
});

test("webhook: a paid purchase gets the email from Gmail, with the zip attached, and is stamped", async () => {
  const id = purchase();
  const res = await webhook(signedEvent(id));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).delivery, "sent");

  assert.equal(mail().length, 1);
  const { options, message } = mail()[0];
  assert.equal(options.host, "smtp.gmail.com");
  assert.equal(options.auth.user, "tobia10donadon@gmail.com");
  assert.equal(options.auth.pass, "abcdefghijklmnop", "the App Password's spaces are removed");
  assert.equal(message.to, "buyer@example.com");
  assert.deepEqual(message.from, { name: "Tobia Donadon", address: "tobia10donadon@gmail.com" });
  assert.equal(message.replyTo, "tobia10donadon@gmail.com");
  assert.equal(message.subject, "Your copy of The 98¢ Trade");
  assert.equal(message.attachments.length, 1);
  assert.equal(message.attachments[0].filename, "the-98c-trade.zip");
  assert.deepEqual(message.attachments[0].content, ZIP, "the attachment is the product file, byte for byte");
  const link = `${ORIGIN}/api/download?session_id=${id}`;
  assert.ok(message.html.includes(link), "the html carries the download link");
  assert.ok(message.text.includes(link), "so does the plain-text part");
  assert.ok(message.text.startsWith("Hi Ada,"));
  assert.ok(message.html.includes("€5"));
  assert.ok(stamp(id), "the payment is marked delivered");
  assert.equal(resendCalls.length, 0, "Resend is not used when Gmail is configured");
});

test("email: a live purchase always links to the public site, even from a local server", async () => {
  const id = purchase();
  globalThis.__stripe.sessions.get(id).livemode = true;
  await webhook(signedEvent(id));
  const { message } = mail()[0];
  const link = `https://www.tobiadonadon.com/api/download?session_id=${id}`;
  assert.ok(message.html.includes(link), "the button points at the public site");
  assert.ok(message.text.includes(link));
  assert.ok(!message.html.includes("localhost") && !message.text.includes("localhost"), "no localhost anywhere");
});

test("email: without a Gmail password it falls back to Resend, still with the attachment", async () => {
  const saved = process.env.GMAIL_APP_PASSWORD;
  delete process.env.GMAIL_APP_PASSWORD;
  try {
    const id = purchase();
    const res = await webhook(signedEvent(id));
    assert.equal((await res.json()).delivery, "sent");
    assert.equal(mail().length, 0);
    assert.equal(resendCalls.length, 1);
    const { body, headers } = resendCalls[0];
    assert.equal(body.from, "Tobia Donadon <tobia10donadon@gmail.com>");
    assert.equal(headers["Idempotency-Key"], `delivery/${id}`);
    assert.deepEqual(Buffer.from(body.attachments[0].content, "base64"), ZIP);
  } finally {
    process.env.GMAIL_APP_PASSWORD = saved;
  }
});

test("email: a refused attachment goes again as a link, and the buyer gets one email", async () => {
  globalThis.__mailRefusesZips = true;
  const id = purchase();
  const res = await webhook(signedEvent(id));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).delivery, "sent");
  assert.equal(mail().length, 2, "one refused by the server, one delivered");
  assert.equal(mail()[0].message.attachments.length, 1);
  const sent = mail()[1].message;
  assert.equal(sent.attachments.length, 0);
  assert.ok(sent.text.includes(`${ORIGIN}/api/download?session_id=${id}`));
  assert.ok(!/attached/i.test(sent.text), "the resent email does not claim an attachment");
  const meta = globalThis.__stripe.paymentIntents.get(`pi_${id}`).metadata;
  assert.ok(meta.delivered_at);
  assert.equal(meta.delivery_file, "link");
});

test("webhook: Launchr ships its own file as a link, never as an attachment Gmail would refuse", async () => {
  const id = purchase({ product: "launchr", name: "Grace Hopper" });
  const res = await webhook(signedEvent(id));
  assert.equal((await res.json()).delivery, "sent");
  assert.equal(mail().length, 1, "one send, no refused attempt first");
  const m = mail()[0].message;
  assert.equal(m.subject, "Your copy of Launchr");
  assert.equal(m.attachments.length, 0);
  const link = `${ORIGIN}/api/download?session_id=${id}`;
  assert.ok(m.text.includes(link) && m.html.includes(link));
  assert.ok(!/attached/i.test(m.text + m.html), "never promises an attachment");
  assert.ok(m.html.includes(">/launchr<"), "the command is set as code");
  assert.ok(m.html.includes("€12"));
  assert.ok(!/TypeSafe|financial advice/i.test(m.text), "none of the bot's copy");
  assert.equal(globalThis.__stripe.paymentIntents.get(`pi_${id}`).metadata.delivery_file, "link");

  const dl = await download(new Request(link));
  assert.equal(dl.status, 200);
  assert.match(dl.headers.get("content-disposition"), /filename="launchr.zip"/);
  assert.deepEqual(Buffer.from(await dl.arrayBuffer()), LAUNCHR_ZIP, "the video skill, not the bot");
});

test("checkout: Launchr charges €12 on its own Stripe product and comes back to its own page", async () => {
  globalThis.__stripe.products.add("prod_VKL1qwlByvTm4z");
  const res = await buy("launchr");
  assert.equal(res.status, 303);
  const params = globalThis.__stripe.createdSessions[0];
  assert.equal(params.line_items[0].price_data.product, "prod_VKL1qwlByvTm4z");
  assert.equal(params.line_items[0].price_data.unit_amount, 1200);
  assert.equal(params.line_items[0].price_data.currency, "eur");
  assert.equal(params.metadata.product, "launchr");
  assert.equal(params.success_url, `${ORIGIN}${LAUNCHR.href}/thanks?session_id={CHECKOUT_SESSION_ID}`);
  assert.equal(params.cancel_url, `${ORIGIN}${LAUNCHR.href}`);
});

test("webhook: the same event twice sends one email", async () => {
  const id = purchase();
  await webhook(signedEvent(id));
  const again = await webhook(signedEvent(id));
  assert.equal(again.status, 200);
  assert.equal((await again.json()).delivery, "already-sent");
  assert.equal(mail().length, 1);
});

test("webhook: a payment still clearing waits, then delivers when it clears", async () => {
  const id = purchase({ paid: false });
  const first = await webhook(signedEvent(id));
  assert.equal((await first.json()).delivery, "not-paid");
  assert.equal(mail().length, 0);

  globalThis.__stripe.sessions.get(id).payment_status = "paid";
  const cleared = await webhook(signedEvent(id, { type: "checkout.session.async_payment_succeeded" }));
  assert.equal((await cleared.json()).delivery, "sent");
  assert.equal(mail().length, 1);
});

test("webhook: if the email fails, Stripe is told to retry, and the retry delivers", async () => {
  const id = purchase();
  globalThis.__mailDown = true;
  const failed = await webhook(signedEvent(id));
  assert.equal(failed.status, 500, "500 makes Stripe retry");
  assert.equal(stamp(id), undefined, "not stamped, so the retry will send");

  globalThis.__mailDown = false;
  const retry = await webhook(signedEvent(id));
  assert.equal(retry.status, 200);
  assert.equal((await retry.json()).delivery, "sent");
  assert.ok(stamp(id));
});

test("webhook: another integration's checkout is acknowledged and ignored", async () => {
  const id = purchase({ product: "someone-elses-thing" });
  const res = await webhook(signedEvent(id));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).reason, "not-ours");
  assert.equal(mail().length, 0);
});

test("webhook: unrelated event types are acknowledged and ignored", async () => {
  const id = purchase();
  const res = await webhook(signedEvent(id, { type: "customer.created" }));
  assert.equal(res.status, 200);
  assert.equal(mail().length, 0);
});

test("email: a buyer's name cannot inject markup", async () => {
  const id = purchase({ name: '<img src=x onerror="alert(1)">' });
  await webhook(signedEvent(id));
  assert.ok(!mail()[0].message.html.includes("<img src=x"), "escaped in the html");
});

/* ================================================================== *
 * The download
 * ================================================================== */

test("download: a paid purchase gets the exact file", async () => {
  const id = purchase();
  const res = await download(new Request(`${ORIGIN}/api/download?session_id=${id}`));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("content-type"), "application/zip");
  assert.match(res.headers.get("content-disposition"), /attachment; filename="the-98c-trade.zip"/);
  assert.equal(res.headers.get("cache-control"), "private, no-store");
  assert.deepEqual(Buffer.from(await res.arrayBuffer()), ZIP);
});

test("download: unpaid, unknown, foreign and malformed ids never get the file", async () => {
  const unpaid = purchase({ paid: false });
  const foreign = purchase({ product: "someone-elses-thing" });
  for (const sid of [unpaid, foreign, "cs_test_doesnotexist000", "../../etc/passwd", ""]) {
    const res = await download(new Request(`${ORIGIN}/api/download?session_id=${encodeURIComponent(sid)}`));
    assert.equal(res.status, 303, `refused: ${sid || "(empty)"}`);
    assert.ok(res.headers.get("location").startsWith(`${ORIGIN}${THE_98C_TRADE.href}/thanks?`));
  }
});

/* ================================================================== *
 * Checkout
 * ================================================================== */

const buy = (product = "the-98c-trade") =>
  checkout(
    new Request(`${ORIGIN}/api/checkout`, {
      method: "POST",
      body: new URLSearchParams({ product }),
      headers: { "content-type": "application/x-www-form-urlencoded" },
    }),
  );

test("checkout: the first sale creates the Stripe product, then every sale reuses it", async () => {
  const res = await buy();
  assert.equal(res.status, 303);
  assert.match(res.headers.get("location"), /^https:\/\/checkout\.stripe\.com\//);
  assert.equal(globalThis.__stripe.createdProducts.length, 1);
  assert.equal(globalThis.__stripe.createdProducts[0].id, THE_98C_TRADE.stripeProductId);

  await buy();
  assert.equal(globalThis.__stripe.createdProducts.length, 1, "created once");

  const params = globalThis.__stripe.createdSessions[0];
  assert.equal(params.mode, "payment");
  assert.equal(params.line_items[0].price_data.unit_amount, 500);
  assert.equal(params.line_items[0].price_data.currency, "eur");
  assert.equal(params.metadata.product, "the-98c-trade");
  assert.equal(params.customer_creation, "always");
  assert.equal(
    params.success_url,
    `${ORIGIN}${THE_98C_TRADE.href}/thanks?session_id={CHECKOUT_SESSION_ID}`,
  );
  assert.equal(params.cancel_url, `${ORIGIN}${THE_98C_TRADE.href}`);
});

test("checkout: Stripe down sends the buyer back to the page with a message", async () => {
  globalThis.__stripe.products.add(THE_98C_TRADE.stripeProductId);
  globalThis.__stripe.failCreate = true;
  const res = await buy();
  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), `${ORIGIN}${THE_98C_TRADE.href}?checkout=error#buy`);
});

test("checkout: an unknown product goes back to the folder", async () => {
  const res = await buy("free-money");
  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), `${ORIGIN}/projects/construct/material/setups`);
});

/* ================================================================== *
 * Health
 * ================================================================== */

test("health: reports a configured shop without printing a secret", async () => {
  const res = await health();
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.stripeMode, "test");
  assert.equal(body.emailVia, "gmail");
  assert.equal(body.files["the-98c-trade"].bytes, ZIP.length);
  assert.equal(body.files.launchr.bytes, LAUNCHR_ZIP.length);
  const raw = JSON.stringify(body);
  for (const secret of [process.env.STRIPE_SECRET_KEY, process.env.STRIPE_WEBHOOK_SECRET, process.env.RESEND_API_KEY, process.env.GMAIL_APP_PASSWORD, "abcdefghijklmnop", fileKey]) {
    assert.ok(!raw.includes(secret));
  }
});
