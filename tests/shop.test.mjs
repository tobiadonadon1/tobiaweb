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
const JEV_ZIP = Buffer.from("PK\u0003\u0004 the chart analyst app " + "j".repeat(2500));
writeFileSync(path.join(cwd, "private", "jev-crypto-analyst.zip.enc"), seal(JEV_ZIP, parseKey(fileKey)));
const MINER_PDF = Buffer.from("%PDF-1.7 the review miner build guide " + "m".repeat(2000));
writeFileSync(path.join(cwd, "private", "jev-review-miner.pdf.enc"), seal(MINER_PDF, parseKey(fileKey)));
const WHITEHAT_PDF = Buffer.from("%PDF-1.7 the whitehat build guide " + "w".repeat(2000));
writeFileSync(path.join(cwd, "private", "whitehat-playbook.pdf.enc"), seal(WHITEHAT_PDF, parseKey(fileKey)));
const APP_DESIGNER_ZIP = Buffer.from("PK\u0003\u0004 the iphone design skill " + "a".repeat(2800));
writeFileSync(path.join(cwd, "private", "app-designer.zip.enc"), seal(APP_DESIGNER_ZIP, parseKey(fileKey)));
const WEB_DESIGNER_ZIP = Buffer.from("PK\u0003\u0004 the web design skill " + "w".repeat(3100));
writeFileSync(path.join(cwd, "private", "web-designer.zip.enc"), seal(WEB_DESIGNER_ZIP, parseKey(fileKey)));
const APP_LAUNCHER_ZIP = Buffer.from("PK\u0003\u0004 the app launch skill " + "l".repeat(3300));
writeFileSync(path.join(cwd, "private", "app-launcher.zip.enc"), seal(APP_LAUNCHER_ZIP, parseKey(fileKey)));
const GROK_ARMY_ZIP = Buffer.from("PK\u0003\u0004 the grok bot army skill " + "g".repeat(3400));
writeFileSync(path.join(cwd, "private", "grok-army.zip.enc"), seal(GROK_ARMY_ZIP, parseKey(fileKey)));
const PRO_ZIP = Buffer.from("PK\u0003\u0004 the iphone and android design skill " + "p".repeat(3600));
writeFileSync(path.join(cwd, "private", "app-designer-pro.zip.enc"), seal(PRO_ZIP, parseKey(fileKey)));
const COPYCAT_ZIP = Buffer.from("PK\u0003\u0004 the copycat detective skill " + "c".repeat(3700));
writeFileSync(path.join(cwd, "private", "copycat-detective.zip.enc"), seal(COPYCAT_ZIP, parseKey(fileKey)));
const VIRAL_ZIP = Buffer.from("PK\u0003\u0004 the x manager for grok bot " + "v".repeat(3800));
writeFileSync(path.join(cwd, "private", "viral-machine.zip.enc"), seal(VIRAL_ZIP, parseKey(fileKey)));
const WDP_ZIP = Buffer.from("PK\u0003\u0004 the website and component design skill " + "w".repeat(3700));
writeFileSync(path.join(cwd, "private", "web-designer-pro.zip.enc"), seal(WDP_ZIP, parseKey(fileKey)));
const DUO_ZIP = Buffer.from("PK\u0003\u0004 the iphone duo design skill " + "d".repeat(3900));
writeFileSync(path.join(cwd, "private", "duo-designer.zip.enc"), seal(DUO_ZIP, parseKey(fileKey)));
process.chdir(cwd);

/* ---- email: Gmail is recorded by the nodemailer mock; Resend, the
        fallback, by this stub ---- */
const resendCalls = [];
const realFetch = globalThis.fetch;
const sheetRows = [];
globalThis.__sheetDown = false;
globalThis.fetch = async (url, init) => {
  if (String(url) === "https://sheet.example/exec") {
    if (globalThis.__sheetDown) return new Response("boom", { status: 500 });
    sheetRows.push(JSON.parse(init.body));
    // Like Google: the script runs, then the reply lives at a second URL.
    if (globalThis.__sheetEcho) {
      return new Response(null, { status: 302, headers: { location: "https://sheet.example/echo" } });
    }
    return new Response("ok");
  }
  if (String(url) === "https://sheet.example/echo") {
    return globalThis.__sheetEcho === "404" ? new Response("<html>Not Found</html>", { status: 404 }) : new Response("ok");
  }
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
const { POST: claim } = await import("../app/api/free/route.ts");
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
function purchase({ paid = true, product = "the-98c-trade", email = "buyer@example.com", name = "Ada Lovelace", status = "complete", amount, paymentStatus } = {}) {
  const id = `cs_test_session${String(++n).padStart(8, "0")}`;
  const pi = `pi_${id}`;
  globalThis.__stripe.paymentIntents.set(pi, { id: pi, object: "payment_intent", metadata: {} });
  globalThis.__stripe.sessions.set(id, {
    id,
    object: "checkout.session",
    status,
    payment_status: paymentStatus ?? (paid ? "paid" : "unpaid"),
    amount_total: amount ?? productById(product)?.priceCents ?? 500,
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

test("health: a product not on sale yet, with no sealed file, is pending and does not fail the shop", async () => {
  const { GROK_ARMY, forSale } = await import("../lib/shop/products.ts");
  if (forSale(GROK_ARMY)) return;
  const { renameSync } = await import("node:fs");
  const sealed = path.join(cwd, "private", "grok-army.zip.enc");
  renameSync(sealed, sealed + ".away");
  try {
    // FIRST in the file on purpose: the shop caches a file once it has
    // read it, so this must run before anything delivers Grok Army. A failed
    // read is never cached, so the tests after it still find the file.
    const body = await (await health()).json();
    assert.equal(body.files["grok-army"].ok, false);
    assert.equal(body.files["grok-army"].pending, true);
    assert.equal(body.ok, true, "a pending product does not fail the shop");
  } finally {
    renameSync(sealed + ".away", sealed);
  }
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
  assert.deepEqual(FOLDER_BY_ID.setups.entries.map((e) => e.slug), ["web-designer-pro", "app-designer-pro", "grok-army", "the-98c-trade", "launchr", "jev-crypto-analyst"], "Web Designer Pro first, then App Designer Pro, Grok Army, the 98¢ Trade, Launchr, Jev");
  // Web Designer Pro: a setup, sold at €5 once on the Stripe product Tobia made ("Web Design 2.0").
  const wdp = productById("web-designer-pro");
  assert.equal(wdp.href, entryHref("setups", "web-designer-pro"));
  assert.equal(FOLDER_BY_ID.setups.entries.find((e) => e.slug === "web-designer-pro")?.product, "web-designer-pro");
  assert.equal(wdp.stripeProductId, "prod_VRir0B4DJgdsn9");
  assert.equal(wdp.priceCents, 500);
  assert.equal(wdp.priceLabel, "€5");
  assert.equal(wdp.file.attach, false, "the skill ships scripts, so the email carries a link");
  // App Designer Pro: a setup, sold at €5 on the Stripe product Tobia made.
  const pro = productById("app-designer-pro");
  assert.equal(pro.href, entryHref("setups", "app-designer-pro"));
  assert.equal(FOLDER_BY_ID.setups.entries.find((e) => e.slug === "app-designer-pro")?.product, "app-designer-pro");
  assert.equal(pro.stripeProductId, "prod_VQa83vPcURQp2m");
  assert.equal(pro.priceCents, 500);
  assert.equal(pro.priceLabel, "€5");
  assert.equal(pro.file.attach, false, "the skill ships scripts, so the email carries a link");
  // Grok Army: a setup, its page and its entry agree.
  const ga = productById("grok-army");
  assert.equal(ga.href, entryHref("setups", "grok-army"));
  assert.equal(FOLDER_BY_ID.setups.entries.find((e) => e.slug === "grok-army")?.product, "grok-army");
  assert.equal(LAUNCHR.priceCents, 1200);
  assert.equal(LAUNCHR.priceLabel, "€12");
  assert.equal(LAUNCHR.stripeProductId, "none");
  assert.equal(ga.stripeProductId, "prod_VKL1qwlByvTm4z", "Launchr's old Stripe product sells Grok Army");
  assert.equal(ga.priceCents, 1500);
  assert.equal(ga.priceLabel, "€15");
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
  assert.ok(message.text.startsWith("Hi,\n"), "a plain hello, no name");
  assert.ok(!message.text.includes("Ada") && !message.html.includes("Ada"), "the buyer's name is not used");
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

test("webhook: a Grok Army purchase gets its own email, as a link, and the link serves its zip", async () => {
  const id = purchase({ product: "grok-army", name: "Grace Hopper" });
  const res = await webhook(signedEvent(id));
  assert.equal((await res.json()).delivery, "sent");
  assert.equal(mail().length, 1, "one send, no refused attempt first");
  const m = mail()[0].message;
  assert.equal(m.subject, "Your copy of Grok Army");
  assert.equal(m.attachments.length, 0, "the skill ships .mjs, so never attached");
  const link = `${ORIGIN}/api/download?session_id=${id}`;
  assert.ok(m.text.includes(link) && m.html.includes(link));
  assert.ok(/Build my army from this file/.test(m.text), "the one line to send Builder");
  assert.ok(/No income is promised/.test(m.text), "never a promise of income");
  assert.ok(!/TypeSafe|Launchr|financial advice/i.test(m.text), "none of another product's copy");
  assert.ok(!/\u2014/.test(m.text + m.html), "no em dashes");
  const dl = await download(new Request(link));
  assert.equal(dl.status, 200);
  assert.match(dl.headers.get("content-disposition"), /filename="grok-army.zip"/);
  assert.deepEqual(Buffer.from(await dl.arrayBuffer()), GROK_ARMY_ZIP);
});

test("checkout: Launchr is free now, so it never opens a checkout", async () => {
  globalThis.__stripe.products.add("prod_VKL1qwlByvTm4z");
  const res = await buy("launchr");
  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), `${ORIGIN}${LAUNCHR.href}`);
  assert.equal(globalThis.__stripe.createdSessions.length, 0, "no Stripe session");
});

/* ================================================================== *
 * Free: "let me know where you want me to send the product"
 * ================================================================== */

const ask = (body, ip = "203.0.113.1") =>
  claim(
    new Request(`${ORIGIN}/api/free`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
    }),
  );

test("free: an address gets the Launchr email with a link that downloads the file, and lands in the sheet", async () => {
  process.env.LEADS_WEBHOOK_URL = "https://sheet.example/exec";
  process.env.LEADS_TOKEN = "sheet-secret";
  sheetRows.length = 0;
  try {
    const res = await ask({ product: "launchr", email: "Grace@Example.com" }, "203.0.113.10");
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });

    assert.equal(mail().length, 1);
    const m = mail()[0].message;
    assert.equal(m.to, "Grace@Example.com");
    assert.equal(m.subject, "Your copy of Launchr");
    assert.equal(m.attachments.length, 0);
    assert.ok(m.text.startsWith("Hi,\n"));
    assert.ok(m.text.includes("Here's Launchr, as promised."));
    assert.ok(!/buying|Paid|€12/.test(m.text + m.html), "nothing about a purchase or a price");
    assert.ok(m.html.includes("Launchr · Free"));

    const link = m.text.match(/http:\/\/localhost:3000\/api\/download\?\S+/)?.[0];
    assert.ok(link, "a download link on this site");
    const dl = await download(new Request(link));
    assert.equal(dl.status, 200);
    assert.match(dl.headers.get("content-disposition"), /filename="launchr.zip"/);
    assert.deepEqual(Buffer.from(await dl.arrayBuffer()), LAUNCHR_ZIP);

    assert.equal(sheetRows.length, 1);
    assert.equal(sheetRows[0].token, "sheet-secret");
    assert.equal(sheetRows[0].email, "Grace@Example.com");
    assert.equal(sheetRows[0].product, "launchr");
  } finally {
    delete process.env.LEADS_WEBHOOK_URL;
    delete process.env.LEADS_TOKEN;
  }
});

test("free: Jev Crypto Analyst sends its own file, and its link never opens Launchr", async () => {
  const { JEV_CRYPTO_ANALYST } = await import("../lib/shop/products.ts");
  const { entryHref, FOLDER_BY_ID } = await import("../components/superhuman/material/material-data.ts");
  assert.equal(JEV_CRYPTO_ANALYST.href, entryHref("setups", "jev-crypto-analyst"));
  assert.equal(FOLDER_BY_ID.setups.entries.find((e) => e.slug === "jev-crypto-analyst")?.product, "jev-crypto-analyst");

  const res = await ask({ product: "jev-crypto-analyst", email: "trader@example.com" }, "203.0.113.40");
  assert.equal(res.status, 200);
  const m = mail()[0].message;
  assert.equal(m.subject, "Your copy of Jev Crypto Analyst");
  assert.equal(m.attachments.length, 0);
  assert.ok(m.text.includes("Not financial advice."));
  const link = m.text.match(/http:\/\/localhost:3000\/api\/download\?\S+/)[0];
  const dl = await download(new Request(link));
  assert.match(dl.headers.get("content-disposition"), /filename="jev-crypto-analyst.zip"/);
  assert.deepEqual(Buffer.from(await dl.arrayBuffer()), JEV_ZIP);

  const swapped = new URL(link);
  swapped.searchParams.set("product", "launchr");
  const other = await download(new Request(swapped));
  assert.equal(other.status, 303, "a Jev link is not a Launchr link");
});

test("free: App Designer is a skill on the Skills shelf, sent as a link, never attached", async () => {
  const { APP_DESIGNER } = await import("../lib/shop/products.ts");
  const { entryHref, FOLDER_BY_ID } = await import("../components/superhuman/material/material-data.ts");
  assert.equal(APP_DESIGNER.href, entryHref("skills", "app-designer"));
  assert.equal(FOLDER_BY_ID.skills.entries.find((e) => e.slug === "app-designer")?.product, "app-designer");
  // It ships scripts, and Gmail refuses a zip that holds them.
  assert.equal(APP_DESIGNER.file.attach, false);

  const res = await ask({ product: "app-designer", email: "designer@example.com" }, "203.0.113.61");
  assert.equal(res.status, 200);
  const m = mail()[0].message;
  assert.equal(m.subject, "Your copy of App Designer");
  assert.equal(m.attachments.length, 0);
  assert.ok(m.html.includes(">/app-designer<"), "the command is set as code");
  const link = m.text.match(/http:\/\/localhost:3000\/api\/download\?\S+/)[0];
  const dl = await download(new Request(link));
  assert.match(dl.headers.get("content-disposition"), /filename="app-designer.zip"/);
  assert.deepEqual(Buffer.from(await dl.arrayBuffer()), APP_DESIGNER_ZIP);

  const swapped = new URL(link);
  swapped.searchParams.set("product", "launchr");
  assert.equal((await download(new Request(swapped))).status, 303, "an App Designer link is not a Launchr link");
});

test("free: Web Designer is a skill beside App Designer, sent as a link, never attached", async () => {
  const { WEB_DESIGNER } = await import("../lib/shop/products.ts");
  const { entryHref, FOLDER_BY_ID } = await import("../components/superhuman/material/material-data.ts");
  assert.equal(WEB_DESIGNER.href, entryHref("skills", "web-designer"));
  const skills = FOLDER_BY_ID.skills.entries;
  assert.equal(skills.find((e) => e.slug === "web-designer")?.product, "web-designer");
  // Right after App Designer on the rack: the next card on a phone.
  assert.equal(skills.findIndex((e) => e.slug === "web-designer"), skills.findIndex((e) => e.slug === "app-designer") + 1);
  // It ships scripts, and Gmail refuses a zip that holds them.
  assert.equal(WEB_DESIGNER.file.attach, false);

  const res = await ask({ product: "web-designer", email: "web@example.com" }, "203.0.113.62");
  assert.equal(res.status, 200);
  const m = mail()[0].message;
  assert.equal(m.subject, "Your copy of Web Designer");
  assert.equal(m.attachments.length, 0);
  assert.ok(m.html.includes(">/web-designer<"), "the command is set as code");
  const link = m.text.match(/http:\/\/localhost:3000\/api\/download\?\S+/)[0];
  const dl = await download(new Request(link));
  assert.match(dl.headers.get("content-disposition"), /filename="web-designer.zip"/);
  assert.deepEqual(Buffer.from(await dl.arrayBuffer()), WEB_DESIGNER_ZIP);

  const swapped = new URL(link);
  swapped.searchParams.set("product", "app-designer");
  assert.equal((await download(new Request(swapped))).status, 303, "a Web Designer link is not an App Designer link");
});

test("free: App Launcher opens a new row on the rack, sent as a link, its commands set as code", async () => {
  const { APP_LAUNCHER } = await import("../lib/shop/products.ts");
  const { entryHref, FOLDER_BY_ID } = await import("../components/superhuman/material/material-data.ts");
  assert.equal(APP_LAUNCHER.href, entryHref("skills", "app-launcher"));
  const skills = FOLDER_BY_ID.skills.entries;
  assert.equal(skills.find((e) => e.slug === "app-launcher")?.product, "app-launcher");
  assert.equal(skills.findIndex((e) => e.slug === "app-launcher"), skills.findIndex((e) => e.slug === "web-designer") + 1);
  assert.equal(APP_LAUNCHER.file.attach, false);

  const res = await ask({ product: "app-launcher", email: "launch@example.com" }, "203.0.113.71");
  assert.equal(res.status, 200);
  const m = mail()[0].message;
  assert.equal(m.subject, "Your copy of App Launcher");
  assert.equal(m.attachments.length, 0);
  assert.ok(m.html.includes(">run app-launcher<"), "the first command is set as code");
  assert.ok(m.html.includes(">run<"), "the everyday command is set as code");
  assert.ok(m.html.includes(">$app-launcher<") && m.html.includes(">/app-launcher<"), "both agents' commands are set as code");
  assert.ok(!m.html.includes("type hi"), "no other product's setup line in the preview text");
  const link = m.text.match(/http:\/\/localhost:3000\/api\/download\?\S+/)[0];
  const dl = await download(new Request(link));
  assert.match(dl.headers.get("content-disposition"), /filename="app-launcher.zip"/);
  assert.deepEqual(Buffer.from(await dl.arrayBuffer()), APP_LAUNCHER_ZIP);

  const swapped = new URL(link);
  swapped.searchParams.set("product", "web-designer");
  assert.equal((await download(new Request(swapped))).status, 303, "an App Launcher link is not a Web Designer link");
});

test("free: Viral Machine is given for an email, its file attached, never a checkout", async () => {
  const { VIRAL_MACHINE, forSale } = await import("../lib/shop/products.ts");
  const { entryHref, FOLDER_BY_ID } = await import("../components/superhuman/material/material-data.ts");
  assert.equal(VIRAL_MACHINE.href, entryHref("skills", "viral-machine"));
  const skills = FOLDER_BY_ID.skills.entries;
  assert.equal(skills.findIndex((e) => e.slug === "viral-machine"), 8, "it closes the third row of the rack");
  assert.equal(VIRAL_MACHINE.free, true);
  assert.equal(forSale(VIRAL_MACHINE), false);

  const res = await ask({ product: "viral-machine", email: "viral@example.com" }, "203.0.113.73");
  assert.equal(res.status, 200);
  const m = mail()[0].message;
  assert.equal(m.subject, "Your copy of Viral Machine");
  assert.equal(m.attachments.length, 1, "two text files, so Gmail takes the zip");
  assert.equal(m.attachments[0].filename, "viral-machine.zip");
  assert.ok(m.text.includes("Set yourself up from this file."));
  const link = m.text.match(/http:\/\/localhost:3000\/api\/download\?\S+/)[0];
  const dl = await download(new Request(link));
  assert.equal(dl.status, 200);
  assert.equal(Buffer.from(await dl.arrayBuffer()).length, VIRAL_ZIP.length);
});

test("free: Duo Designer opens the fourth row, sent as a link for an email, at once for a member", async () => {
  const { DUO_DESIGNER, forSale } = await import("../lib/shop/products.ts");
  const { entryHref, FOLDER_BY_ID } = await import("../components/superhuman/material/material-data.ts");
  assert.equal(DUO_DESIGNER.href, entryHref("skills", "duo-designer"));
  const skills = FOLDER_BY_ID.skills.entries;
  assert.equal(skills.find((e) => e.slug === "duo-designer")?.product, "duo-designer");
  // The tenth card: the rack is three wide, so it starts the fourth row.
  assert.equal(skills.findIndex((e) => e.slug === "duo-designer"), 9);
  assert.equal(skills.at(-1)?.slug, "duo-designer");
  assert.equal(DUO_DESIGNER.free, true);
  assert.equal(DUO_DESIGNER.accountOnly, undefined, "an email is enough, no account needed");
  assert.equal(forSale(DUO_DESIGNER), false);
  assert.equal(DUO_DESIGNER.stripeProductId, "none");
  // It ships scripts (.mjs), and Gmail refuses a zip that holds them.
  assert.equal(DUO_DESIGNER.file.attach, false);
  // Nobody can promise App Review approval, and no word about it does.
  const words = [DUO_DESIGNER.description, DUO_DESIGNER.share.description, ...DUO_DESIGNER.email.after].join(" ");
  assert.ok(!/guarantee|always approved|never rejected/i.test(words), "no approval promised");

  // An email: the link only, both agents' commands set as code.
  const res = await ask({ product: "duo-designer", email: "fold@example.com" }, "203.0.113.81");
  assert.equal(res.status, 200);
  assert.equal(mail().length, 1);
  const m = mail()[0].message;
  assert.equal(m.to, "fold@example.com");
  assert.equal(m.subject, "Your copy of Duo Designer");
  assert.equal(m.attachments.length, 0);
  assert.ok(m.html.includes(">/duo-designer<") && m.html.includes(">$duo-designer<"), "both agents' commands are set as code");
  assert.ok(m.html.includes(">codex<") && m.html.includes(">hi<"));
  const link = m.text.match(/http:\/\/localhost:3000\/api\/download\?\S+/)[0];
  const dl = await download(new Request(link));
  assert.equal(dl.status, 200);
  assert.equal(dl.headers.get("content-type"), "application/zip");
  assert.match(dl.headers.get("content-disposition"), /filename="duo-designer.zip"/);
  assert.deepEqual(Buffer.from(await dl.arrayBuffer()), DUO_ZIP);

  // A tampered, borrowed or swapped link never downloads it.
  for (const change of [
    (u) => u.searchParams.set("t", "A".repeat(32)),
    (u) => u.searchParams.set("e", "someone-else@example.com"),
    (u) => u.searchParams.delete("t"),
    (u) => u.searchParams.set("product", "app-designer"),
  ]) {
    const u = new URL(link);
    change(u);
    const r = await download(new Request(u));
    assert.equal(r.status, 303, u.search);
  }
  const back = await download(new Request(`${ORIGIN}/api/download?product=duo-designer&e=fold@example.com&t=${"B".repeat(32)}`));
  assert.equal(back.headers.get("location"), `${ORIGIN}${DUO_DESIGNER.href}#claim`, "a forgery goes back to the form");

  // A member's link (what /api/free hands a signed-in visitor) serves the exact file.
  const { freeLink } = await import("../lib/shop/free.ts");
  const member = await download(new Request(freeLink(ORIGIN, DUO_DESIGNER, "member@example.com")));
  assert.deepEqual(Buffer.from(await member.arrayBuffer()), DUO_ZIP);
});

test("free: Duo Designer's newsletter tick is recorded only when it is a real tick", async () => {
  process.env.LEADS_WEBHOOK_URL = "https://sheet.example/exec";
  sheetRows.length = 0;
  try {
    assert.equal((await ask({ product: "duo-designer", email: "duo-yes@example.com", newsletter: true }, "203.0.113.82")).status, 200);
    assert.equal((await ask({ product: "duo-designer", email: "duo-no@example.com" }, "203.0.113.83")).status, 200);
    assert.equal((await ask({ product: "duo-designer", email: "duo-str@example.com", newsletter: "yes" }, "203.0.113.84")).status, 200);
    assert.equal(sheetRows.length, 3);
    assert.deepEqual(sheetRows.map((r) => r.product), ["duo-designer", "duo-designer", "duo-designer"]);
    assert.equal(sheetRows[0].page, "/projects/construct/material/skills/duo-designer · newsletter");
    assert.equal(sheetRows[1].page, "/projects/construct/material/skills/duo-designer");
    assert.equal(sheetRows[2].page, "/projects/construct/material/skills/duo-designer", "only a boolean true is a tick");
  } finally {
    delete process.env.LEADS_WEBHOOK_URL;
  }
});

test("free: Copycat Detective sits beside App Launcher, free with an account, never emailed", async () => {
  const { COPYCAT_DETECTIVE } = await import("../lib/shop/products.ts");
  const { entryHref, FOLDER_BY_ID } = await import("../components/superhuman/material/material-data.ts");
  assert.equal(COPYCAT_DETECTIVE.href, entryHref("skills", "copycat-detective"));
  const skills = FOLDER_BY_ID.skills.entries;
  assert.equal(skills.find((e) => e.slug === "copycat-detective")?.product, "copycat-detective");
  assert.equal(skills.findIndex((e) => e.slug === "copycat-detective"), skills.findIndex((e) => e.slug === "app-launcher") + 1);
  assert.equal(COPYCAT_DETECTIVE.free, true);
  assert.equal(COPYCAT_DETECTIVE.file.attach, false);
  // Its own words never call anyone a copycat beyond its name, and never promise a verdict.
  const words = [COPYCAT_DETECTIVE.description, COPYCAT_DETECTIVE.share.description, ...COPYCAT_DETECTIVE.email.after].join(" ");
  assert.ok(!/\b(thie|stole|steal|expos)/i.test(words), "facts, not verdicts");

  // Free with an account: an address typed into the form gets nothing emailed.
  assert.equal(COPYCAT_DETECTIVE.accountOnly, true);
  const res = await ask({ product: "copycat-detective", email: "receipts@example.com" }, "203.0.113.73");
  assert.equal(res.status, 401);
  assert.equal((await res.json()).error, "sign-in");
  assert.equal(mail().length, 0, "nothing is sent");
  // A signed-in member's link (what /api/free hands them) serves the exact file.
  const { freeLink } = await import("../lib/shop/free.ts");
  const link = freeLink("http://localhost:3000", COPYCAT_DETECTIVE, "receipts@example.com");
  const dl = await download(new Request(link));
  assert.match(dl.headers.get("content-disposition"), /filename="copycat-detective.zip"/);
  assert.deepEqual(Buffer.from(await dl.arrayBuffer()), COPYCAT_ZIP);

  const swapped = new URL(link);
  swapped.searchParams.set("product", "app-launcher");
  assert.equal((await download(new Request(swapped))).status, 303, "a Copycat Detective link is not an App Launcher link");
});

test("email: \"costs to run\" in prose is not set as code", async () => {
  const { JEV_REVIEW_MINER } = await import("../lib/shop/products.ts");
  assert.ok(JEV_REVIEW_MINER.email.after.some((p) => /costs to run/.test(p)), "the prose this guards is still there");
  const res = await ask({ product: "jev-review-miner", email: "prose@example.com" }, "203.0.113.72");
  assert.equal(res.status, 200);
  assert.ok(!mail()[0].message.html.includes(">run<"));
});

test("free: Jev Review Miner arrives as an attached PDF, and its link serves the PDF", async () => {
  const { JEV_REVIEW_MINER } = await import("../lib/shop/products.ts");
  const { entryHref, FOLDER_BY_ID } = await import("../components/superhuman/material/material-data.ts");
  assert.equal(JEV_REVIEW_MINER.href, entryHref("guides", "jev-review-miner"));
  assert.equal(FOLDER_BY_ID.guides.entries.find((e) => e.slug === "jev-review-miner")?.product, "jev-review-miner");

  const res = await ask({ product: "jev-review-miner", email: "maker@example.com" }, "203.0.113.41");
  assert.equal(res.status, 200);
  const m = mail()[0].message;
  assert.equal(m.to, "maker@example.com");
  assert.equal(m.subject, "Your copy of Jev Review Miner");
  assert.equal(m.attachments.length, 1);
  assert.equal(m.attachments[0].filename, "jev-review-miner-build-guide.pdf");
  assert.equal(m.attachments[0].contentType, "application/pdf");
  assert.deepEqual(Buffer.from(m.attachments[0].content), MINER_PDF);
  assert.ok(m.text.includes("Here's Jev Review Miner, as promised. Your copy is attached"));
  assert.ok(!/buying|Unzip|type hi/.test(m.text + m.html), "no purchase or zip wording for a PDF");

  const link = m.text.match(/http:\/\/localhost:3000\/api\/download\?\S+/)[0];
  const dl = await download(new Request(link));
  assert.equal(dl.headers.get("content-type"), "application/pdf");
  assert.match(dl.headers.get("content-disposition"), /filename="jev-review-miner-build-guide.pdf"/);
  assert.deepEqual(Buffer.from(await dl.arrayBuffer()), MINER_PDF);
});

test("free: a link that was tampered with, borrowed or made up never downloads", async () => {
  await ask({ product: "launchr", email: "ada@example.com" }, "203.0.113.11");
  const link = new URL(mail()[0].message.text.match(/http:\/\/localhost:3000\/api\/download\?\S+/)[0]);
  const tries = [
    (u) => u.searchParams.set("t", "A".repeat(32)),
    (u) => u.searchParams.set("e", "someone-else@example.com"),
    (u) => u.searchParams.delete("t"),
    (u) => u.searchParams.set("product", "the-98c-trade"),
  ];
  for (const change of tries) {
    const u = new URL(link);
    change(u);
    const res = await download(new Request(u));
    assert.equal(res.status, 303, u.search);
    assert.notEqual(res.headers.get("content-type"), "application/zip");
  }
});

test("free: bots, bad addresses and paid products get nothing sent", async () => {
  const bot = await ask({ product: "launchr", email: "bot@example.com", website: "http://spam" }, "203.0.113.12");
  assert.deepEqual(await bot.json(), { ok: true }, "a bot is told yes and learns nothing");
  const bad = await ask({ product: "launchr", email: "not-an-address" }, "203.0.113.12");
  assert.equal(bad.status, 400);
  const paid = await ask({ product: "the-98c-trade", email: "free-bot@example.com" }, "203.0.113.12");
  assert.equal(paid.status, 404, "the bot is not free");
  assert.equal(mail().length, 0);
});

test("free: the same address a third time in ten minutes is held back", async () => {
  for (let i = 0; i < 2; i++) {
    const ok = await ask({ product: "launchr", email: "twice@example.com" }, `203.0.113.2${i}`);
    assert.equal(ok.status, 200);
  }
  const third = await ask({ product: "launchr", email: "twice@example.com" }, "203.0.113.29");
  assert.equal(third.status, 429);
  assert.equal(mail().length, 2);
});

test("free: Google's reply page failing after the row went in never writes the row twice", async () => {
  process.env.LEADS_WEBHOOK_URL = "https://sheet.example/exec";
  for (const mode of ["ok", "404"]) {
    sheetRows.length = 0;
    globalThis.__sheetEcho = mode;
    try {
      const res = await ask({ product: "jev-crypto-analyst", email: `echo-${mode}@example.com` }, `203.0.113.5${mode.length}`);
      assert.equal(res.status, 200);
      assert.equal(sheetRows.length, 1, `one row when the reply is ${mode}`);
    } finally {
      globalThis.__sheetEcho = undefined;
    }
  }
  delete process.env.LEADS_WEBHOOK_URL;
});

test("free: if Gmail fails the visitor is told, and the address is still kept", async () => {
  process.env.LEADS_WEBHOOK_URL = "https://sheet.example/exec";
  sheetRows.length = 0;
  globalThis.__mailDown = true;
  try {
    const res = await ask({ product: "launchr", email: "unlucky@example.com" }, "203.0.113.30");
    assert.equal(res.status, 502);
    assert.equal(sheetRows.length, 1);
    assert.match(sheetRows[0].page, /send failed/);
  } finally {
    delete process.env.LEADS_WEBHOOK_URL;
  }
});

test("free: the newsletter box rides with the claim, and only a real tick marks the lead row", async () => {
  process.env.LEADS_WEBHOOK_URL = "https://sheet.example/exec";
  sheetRows.length = 0;
  try {
    const ticked = await ask({ product: "launchr", email: "yes-please@example.com", newsletter: true }, "203.0.113.40");
    assert.equal(ticked.status, 200);
    const left = await ask({ product: "launchr", email: "no-thanks@example.com" }, "203.0.113.41");
    assert.equal(left.status, 200);
    const sneaky = await ask({ product: "launchr", email: "string@example.com", newsletter: "true" }, "203.0.113.42");
    assert.equal(sneaky.status, 200);
    assert.equal(sheetRows.length, 3);
    assert.match(sheetRows[0].page, / · newsletter$/);
    assert.doesNotMatch(sheetRows[1].page, /newsletter/);
    assert.doesNotMatch(sheetRows[2].page, /newsletter/, "only a boolean true is a tick");
  } finally {
    delete process.env.LEADS_WEBHOOK_URL;
  }
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

test("checkout: Grok Army before its Stripe product exists never reaches Stripe", async () => {
  const { GROK_ARMY, forSale, priceText } = await import("../lib/shop/products.ts");
  // This test is about the waiting state. Once Tobia's prod_ id is in, it
  // no longer applies, and the product is sold like the 98¢ Trade.
  if (forSale(GROK_ARMY)) return;
  assert.equal(priceText(GROK_ARMY), "Coming soon", "no placeholder price is ever printed");
  const res = await buy("grok-army");
  assert.equal(res.status, 303);
  assert.equal(res.headers.get("location"), `${ORIGIN}${GROK_ARMY.href}?checkout=soon#buy`);
  assert.equal(globalThis.__stripe.createdSessions.length, 0, "no checkout session");
  assert.equal(globalThis.__stripe.createdProducts.length, 0, "no stray product created");
});

test("forSale: only a paid product with a real Stripe product id", async () => {
  const { forSale, PRODUCTS } = await import("../lib/shop/products.ts");
  assert.equal(forSale(THE_98C_TRADE), true);
  assert.equal(forSale(LAUNCHR), false, "free");
  assert.equal(forSale({ ...THE_98C_TRADE, stripeProductId: "" }), false, "no id yet");
  assert.equal(forSale({ ...THE_98C_TRADE, stripeProductId: "grok-army" }), false, "a made-up id is not one");
  for (const p of Object.values(PRODUCTS)) {
    if (!p.free && p.id !== "grok-army") assert.equal(forSale(p), true, `${p.id} is on sale`);
  }
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
  assert.equal(body.files["grok-army"].bytes, GROK_ARMY_ZIP.length);
  assert.equal(body.files["app-designer-pro"].bytes, PRO_ZIP.length);
  assert.equal(body.files["viral-machine"].bytes, VIRAL_ZIP.length);
  assert.equal(body.files["web-designer-pro"].bytes, WDP_ZIP.length);
  assert.equal(body.files["duo-designer"].bytes, DUO_ZIP.length);
  const raw = JSON.stringify(body);
  for (const secret of [process.env.STRIPE_SECRET_KEY, process.env.STRIPE_WEBHOOK_SECRET, process.env.RESEND_API_KEY, process.env.GMAIL_APP_PASSWORD, "abcdefghijklmnop", fileKey]) {
    assert.ok(!raw.includes(secret));
  }
});

test("no bypass: a zero total or a no-payment-required session never gets App Designer Pro", async () => {
  const { findPurchase } = await import("../lib/shop/stripe.ts");
  for (const opts of [{ amount: 0 }, { paymentStatus: "no_payment_required", amount: 0 }, { paymentStatus: "no_payment_required" }]) {
    const id = purchase({ product: "app-designer-pro", ...opts });
    const p = await findPurchase(id);
    assert.equal(p.paid, false, JSON.stringify(opts));
    const dl = await download(new Request(`${ORIGIN}/api/download?session_id=${id}`));
    assert.equal(dl.status, 303, "no file, back to the thank-you page");
    assert.ok(!dl.headers.get("content-disposition"));
  }
  const ok = purchase({ product: "app-designer-pro" });
  const dl = await download(new Request(`${ORIGIN}/api/download?session_id=${ok}`));
  assert.equal(dl.status, 200);
  assert.match(dl.headers.get("content-disposition"), /filename="app-designer-pro.zip"/);
});


test("a gift: the link opens App Designer Pro for that address only, and a free token or a forgery never does", async () => {
  const { APP_DESIGNER_PRO, APP_DESIGNER } = await import("../lib/shop/products.ts");
  const { giftLink, freeToken, giftToken } = await import("../lib/shop/free.ts");
  const { sendGift } = await import("../lib/shop/deliver.ts");
  const to = "Friend@Example.com";

  const link = giftLink(ORIGIN, APP_DESIGNER_PRO, to);
  const ok = await download(new Request(link));
  assert.equal(ok.status, 200);
  assert.match(ok.headers.get("content-disposition"), /filename="app-designer-pro.zip"/);
  assert.deepEqual(Buffer.from(await ok.arrayBuffer()), PRO_ZIP);

  const q = (e, g) => `${ORIGIN}/api/download?${new URLSearchParams({ product: "app-designer-pro", e, g })}`;
  const refused = [
    q("someone@else.com", giftToken(APP_DESIGNER_PRO, to)),              // another address
    q(to.toLowerCase(), freeToken(APP_DESIGNER_PRO, to)),                 // a free-product token
    q(to.toLowerCase(), giftToken(APP_DESIGNER, to)),                     // a gift for another product
    q(to.toLowerCase(), "x".repeat(32)),                                  // made up
    `${ORIGIN}/api/download?${new URLSearchParams({ product: "app-designer-pro", e: to, t: giftToken(APP_DESIGNER_PRO, to) })}`, // wrong parameter
  ];
  for (const url of refused) {
    const res = await download(new Request(url));
    assert.equal(res.status, 303, url);
    assert.ok(!res.headers.get("content-disposition"), url);
  }

  mail().length = 0;
  await sendGift(APP_DESIGNER_PRO, to, "https://www.tobiadonadon.com");
  const sent = mail().at(-1).message;
  assert.equal(sent.to, to);
  assert.equal(sent.subject, "Your copy of App Designer Pro");
  assert.equal(sent.attachments.length, 0);
  assert.ok(sent.text.includes("Here's App Designer Pro, on me."));
  assert.ok(sent.text.includes(giftLink("https://www.tobiadonadon.com", APP_DESIGNER_PRO, to)));
  assert.ok(sent.html.includes("App Designer Pro · A gift"));
  assert.ok(!/as promised|Thanks for buying/.test(sent.text));
});
