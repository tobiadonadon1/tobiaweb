/**
 * THE WELCOME EMAIL, BY HAND.
 *
 *   node scripts/welcome.mjs preview [pro|ultimate] [name]
 *       Writes the email (card inlined) and the card to the system temp
 *       folder and prints where. Sends nothing.
 *
 *   node scripts/welcome.mjs test <email> [pro|ultimate] [name]
 *       Sends a sample to an address (yours), exactly as a member gets it.
 *       Touches nothing in Stripe.
 *
 *   node scripts/welcome.mjs send <member email> [--again]
 *       Welcomes a real member whose subscription started before the webhook
 *       sent welcomes: finds their finished subscription checkout in Stripe
 *       and sends the same email the webhook would, stamped the same way.
 *       Skips a member already welcomed, unless --again.
 *
 * Reads STRIPE_SECRET_KEY, SHOP_FILE_KEY (the Telegram link) and
 * GMAIL_APP_PASSWORD from .env.local. A live key welcomes live members.
 */
import { registerHooks } from "node:module";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { resolve } from "../tests/support/hooks.mjs";

// The tests' resolver for "@/" and extensionless TypeScript imports, minus its
// mocks: this talks to the real Stripe and sends real mail.
registerHooks({
  resolve: (specifier, context, next) =>
    specifier === "stripe" || specifier === "nodemailer" ? next(specifier, context) : resolve(specifier, context, next),
});

process.loadEnvFile(".env.local");

const { renderWelcome, memberName, welcomeMember } = await import("../lib/membership/welcome.ts");
const { sealedLink } = await import("../lib/membership/contact.ts");
const { stripe } = await import("../lib/shop/stripe.ts");
const { ACCOUNT_HREF } = await import("../components/account/links.ts");
const { SITE } = await import("../lib/site.ts");

const [cmd, ...args] = process.argv.slice(2);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usage = () => {
  console.error("usage: scripts/welcome.mjs preview [pro|ultimate] [name] | test <email> [pro|ultimate] [name] | send <member email> [--again]");
  process.exit(1);
};

async function sample(tier = "pro", name = "Alex Rivera") {
  if (!["pro", "ultimate"].includes(tier)) usage();
  const telegram = (await sealedLink("telegram"))?.url ?? null;
  return renderWelcome({
    tier,
    name: memberName(name),
    since: Math.floor(Date.now() / 1000),
    telegram,
    account: `${SITE}${ACCOUNT_HREF}`,
  });
}

if (cmd === "preview") {
  const [tier, ...name] = args;
  const m = await sample(tier, name.join(" ") || undefined);
  const dir = tmpdir();
  const html = path.join(dir, `welcome-${tier ?? "pro"}.html`);
  const png = path.join(dir, `welcome-${tier ?? "pro"}-card.png`);
  await writeFile(html, m.html.replace(/cid:[^"]+/, `data:image/png;base64,${m.card.toString("base64")}`));
  await writeFile(png, m.card);
  console.log(`subject: ${m.subject}\n${html}\n${png}`);
} else if (cmd === "test") {
  const [to, tier, ...name] = args;
  if (!EMAIL.test(to ?? "")) usage();
  const m = await sample(tier, name.join(" ") || undefined);
  const nodemailer = (await import("nodemailer")).default;
  const { SHOP_EMAIL } = await import("../lib/shop/products.ts");
  const user = process.env.SHOP_EMAIL_FROM || SHOP_EMAIL;
  const info = await nodemailer
    .createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass: (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "") } })
    .sendMail({
      from: { name: "Tobia Donadon", address: user },
      to,
      replyTo: user,
      subject: m.subject,
      text: m.text,
      html: m.html,
      attachments: [{ filename: "member-card.png", content: m.card, contentType: "image/png", cid: /cid:([^"]+)/.exec(m.html)[1] }],
    });
  console.log(`sent a ${tier ?? "pro"} sample to ${to} (${info.messageId})`);
} else if (cmd === "send") {
  const [email, flag] = args;
  if (!EMAIL.test(email ?? "")) usage();
  const sessions = await stripe().checkout.sessions.list({ customer_details: { email: email.trim() }, limit: 20 });
  const done = sessions.data.filter((s) => s.mode === "subscription" && s.status === "complete");
  if (!done.length) {
    console.error(`no finished subscription checkout for ${email}`);
    process.exit(1);
  }
  const result = await welcomeMember(done[0].id, SITE, { force: flag === "--again" });
  console.log(`${email}: ${result.status}${result.status === "sent" ? ` via ${result.via} (${result.id})` : ""}`);
} else {
  usage();
}
