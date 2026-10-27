import nodemailer from "nodemailer";
import type Stripe from "stripe";
import { ACCOUNT_HREF } from "@/components/account/links";
import { SHOP_EMAIL } from "@/lib/shop/products";
import { ShopNotConfigured, stripe } from "@/lib/shop/stripe";
import { SITE } from "@/lib/site";
import { sealedLink } from "./contact";
import { tierOfPrice } from "./server";
import { PLANS, type PaidTier } from "./tiers";
import { memberCard } from "./welcome-card";

/**
 * THE WELCOME EMAIL, FOR EVERY NEW MEMBER.
 *
 * Someone just put money on themselves. The email says congratulations by
 * name, shows them their member card (welcome-card.ts), says plainly what is
 * theirs now, and gives the straightest lines to Tobia: Telegram, and a reply
 * that lands in his inbox.
 *
 * WHEN. Stripe's webhook calls `welcomeMember` once a subscription checkout
 * has finished and been copied into `subscriptions`. A plan changed later in
 * the billing portal is not a new member, and gets nothing.
 *
 * ONCE. The subscription is stamped `welcomed_at` after the send, and a
 * stamped one is skipped, so a retried or duplicated webhook never sends a
 * second email. Like the delivery email, a failed send throws, the webhook
 * answers 500 and Stripe retries.
 *
 * THE NAME is the one typed at checkout (the cardholder's), tidied: a card
 * name in capitals reads as a name, and anything that doesn't look like one
 * (digits, an address, a company) leaves the email and the card without it.
 */

const FROM_NAME = "Tobia Donadon";
const RESEND = "https://api.resend.com/emails";
const CARD_CID = "member-card@construct";
const AVATAR = `${SITE}/shop/copycat-detective/tobi-avatar-v1.jpg`;

const sender = () => process.env.SHOP_EMAIL_FROM || SHOP_EMAIL;

export type Welcome =
  | { status: "sent"; id: string; via: "gmail" | "resend" }
  | { status: "already-sent" | "not-ours" | "not-paid" | "no-email" };

/* ------------------------------------------------------------------ *
 * THE NAME
 * ------------------------------------------------------------------ */

export type Name = { first: string; full: string };

const word = (w: string) =>
  w
    .split(/([-'’])/)
    .map((part) => (/^[-'’]$/.test(part) ? part : part.charAt(0).toLocaleUpperCase() + part.slice(1).toLocaleLowerCase()))
    .join("");

export function memberName(raw: string | null | undefined): Name | null {
  const s = (raw ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
  if (!s || s.length > 60 || /[\d@&/\\_]|\b(ltd|llc|inc|gmbh|srl|spa)\b/i.test(s)) return null;
  if (!/^\p{L}[\p{L}\p{M} .'’-]*$/u.test(s)) return null;
  // Typed all in capitals or all in lowercase (a card name, mostly): give it its capitals back.
  const recase = s === s.toLocaleUpperCase() || s === s.toLocaleLowerCase();
  const words = s.split(" ").map((w) => (recase ? word(w) : w));
  return { first: words[0], full: words.join(" ") };
}

/* ------------------------------------------------------------------ *
 * THE MESSAGE
 * ------------------------------------------------------------------ */

/** What's theirs now, said short. Universal is set up by hand, so it reads like Ultimate. */
const YOURS: Record<PaidTier, string[]> = {
  pro: [
    "Every premium skill, included",
    "Masterclass: the in-depth lessons, never on YouTube",
    "Design: the component library, ready to copy into your site",
    "The live Q&amp;A and workshop, twice a month",
    "A direct line to me on Telegram",
  ],
  ultimate: [
    "Everything in Pro, every premium skill included",
    "Exclusive skills, only for Ultimate",
    "The complete training library",
    "Your private 1-on-1 call with me",
    "The network, and a vote on what I build next",
  ],
  universal: [
    "Everything in Ultimate",
    "Me, hands-on, building your product with you",
    "Design reviews, with improved versions delivered",
    "Go-to-market and marketing strategy",
    "A direct line to me on Telegram",
  ],
};

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function welcomeEmail({
  tier,
  name,
  telegram,
  account,
  card = true,
}: {
  tier: PaidTier;
  name: Name | null;
  /** The Telegram link, or null when it can't be opened (then the email points at the account page). */
  telegram: string | null;
  account: string;
  /** Whether the member card goes with it (as an inline attachment). */
  card?: boolean;
}) {
  const plan = PLANS[tier].name;
  const first = name ? escape(name.first) : null;
  const subject = name ? `Welcome to ${plan}, ${name.first}.` : `Welcome to ${plan}.`;
  const preheader = "You're in. Here's what's yours now, and the fastest way to reach me.";
  const yours = YOURS[tier];

  const reach = telegram
    ? "Text me on Telegram, or just reply to this email. Both come straight to me."
    : "Reply to this email, or message me on Telegram from your account page. Both come straight to me.";

  const paras = [
    "What you're doing is insane. Most people only talk about building with AI. You just put money on yourself to actually do it.",
    `You're now inside Construct ${plan}, with people who ship every week. Here's what's open to you, starting today:`,
  ];
  const support = [
    `And I mean this: I'm here to support you more than ever. Stuck on something, want feedback, or want to show me what you're working on? ${reach}`,
    "If there's something you'd love to see from me (a skill, a lesson, a breakdown of how I made something), tell me. I'm listening.",
  ];

  const text = [
    name ? `Congratulations, ${name.first}.` : "Congratulations.",
    "",
    ...paras.flatMap((p) => [p, ""]),
    ...yours.map((y) => `- ${y.replace(/&amp;/g, "&")}`),
    "",
    ...support.flatMap((p) => [p, ""]),
    ...(telegram ? [`Telegram: ${telegram}`] : []),
    `Your membership: ${account}`,
    "",
    "Let's build something great.",
    "Tobia",
  ].join("\n");

  const ink = "#0b1f3a";
  const soft = "rgba(11,31,58,0.62)";
  // The accent of the card it comes with: Pro's ember, Ultimate's midnight blue.
  const ember = tier === "pro" ? "#c8401f" : "#1d3480";
  const rule = "rgba(11,31,58,0.1)";
  const font = "'Host Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif";
  const p = (s: string, extra = "") =>
    `<p style="margin:0 0 18px;font:400 16px/1.65 ${font};color:${ink};${extra}">${s}</p>`;
  const item = (s: string, last: boolean) =>
    `<tr><td width="22" style="padding:13px 0;vertical-align:top;${last ? "" : `border-bottom:1px solid ${rule};`}"><div style="width:8px;height:8px;margin-top:8px;border-radius:8px;background:${ember};font-size:0;line-height:0;">&nbsp;</div></td><td style="padding:13px 0;${last ? "" : `border-bottom:1px solid ${rule};`}font:500 15px/1.5 ${font};color:${ink};">${s}</td></tr>`;
  // Side by side where they fit, one under the other on a narrow phone.
  const button = (href: string, label: string, primary: boolean) =>
    `<a href="${escape(href)}" style="display:inline-block;margin:0 8px 10px 0;padding:15px 26px;border-radius:999px;background:${primary ? ember : "#ffffff"};border:1px solid ${primary ? ember : rule};font:600 15px/1 ${font};color:${primary ? "#ffffff" : ink};text-decoration:none;white-space:nowrap;">${label}</a>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>${escape(subject)}</title></head>
<body style="margin:0;padding:0;background:#faf8f2;">
<div style="display:none;max-height:0;overflow:hidden;">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f2;"><tr><td align="center" style="padding:36px 16px 48px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding:0 4px 8px;font:500 12px/1 ${font};letter-spacing:0.18em;text-transform:uppercase;color:${soft};">Construct · ${escape(plan)}</td></tr>
${card ? `<tr><td><img src="cid:${CARD_CID}" width="560" alt="${escape(`Your Construct ${plan} member card${name ? `, ${name.full}` : ""}`)}" style="display:block;width:100%;max-width:560px;height:auto;border:0;"></td></tr>` : ""}
<tr><td style="padding:12px 4px 0;">
<h1 style="margin:0 0 20px;font:600 36px/1.1 ${font};letter-spacing:-0.025em;color:${ink};">Congratulations${first ? `, <span style="color:${ember};">${first}</span>` : ""}.</h1>
${paras.map((s) => p(escape(s))).join("\n")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:2px 0 26px;background:#ffffff;border:1px solid ${rule};border-radius:18px;"><tr><td style="padding:6px 22px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${yours.map((y, i) => item(y, i === yours.length - 1)).join("\n")}
</table>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;"><tr>
<td width="64" style="vertical-align:top;padding:2px 16px 0 0;"><img src="${AVATAR}" width="48" height="48" alt="Tobia" style="display:block;width:48px;height:48px;border-radius:48px;border:0;"></td>
<td style="vertical-align:top;">
${support.map((s) => p(escape(s))).join("\n")}
</td></tr></table>
<div style="margin:0 0 26px;">${telegram ? button(telegram, "Message me on Telegram", true) : ""}${button(account, "Open your membership", !telegram)}</div>
${p("Let's build something great.", "margin-bottom:4px;")}
${p("Tobia", "font-weight:600;")}
<p style="margin:30px 0 0;padding-top:20px;border-top:1px solid ${rule};font:400 13px/1.6 ${font};color:${soft};">Your plan, billing and every perk live on <a href="${escape(account)}" style="color:${soft};">your account page</a>. Cancel any time from there.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;

  return { subject, html, text };
}

/* ------------------------------------------------------------------ *
 * THE SEND
 * ------------------------------------------------------------------ */

export type Outgoing = { to: string; subject: string; html: string; text: string; card: Buffer | null; key: string };

async function viaGmail(msg: Outgoing): Promise<string> {
  const user = sender();
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
  const info = await nodemailer
    .createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass }, connectionTimeout: 15_000, socketTimeout: 30_000 })
    .sendMail({
      from: { name: FROM_NAME, address: user },
      to: msg.to,
      replyTo: user,
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
      attachments: msg.card ? [{ filename: "member-card.png", content: msg.card, contentType: "image/png", cid: CARD_CID }] : [],
    });
  if (!info.accepted?.length) throw new Error(`Gmail did not accept the welcome email: ${info.response ?? "no response"}`);
  return info.messageId;
}

async function viaResend(msg: Outgoing): Promise<string> {
  const res = await fetch(RESEND, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": msg.key,
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${process.env.RESEND_EMAIL_FROM || sender()}>`,
      to: [msg.to],
      reply_to: sender(),
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      attachments: msg.card ? [{ filename: "member-card.png", content: msg.card.toString("base64"), content_id: CARD_CID }] : undefined,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!res.ok || !body.id) throw new Error(`Resend refused the welcome email (${res.status}): ${body.message ?? "no message"}`);
  return body.id;
}

/** Gmail first, Resend when Gmail refuses (or is not set up). Also sends the Masterclass lesson email. */
export async function send(msg: Outgoing): Promise<{ id: string; via: "gmail" | "resend" }> {
  if (!process.env.GMAIL_APP_PASSWORD) {
    if (!process.env.RESEND_API_KEY) throw new ShopNotConfigured("GMAIL_APP_PASSWORD");
    return { id: await viaResend(msg), via: "resend" };
  }
  try {
    return { id: await viaGmail(msg), via: "gmail" };
  } catch (err) {
    if (!process.env.RESEND_API_KEY) throw err;
    console.warn("[membership] Gmail refused the welcome email, sending it through Resend", err);
    return { id: await viaResend(msg), via: "resend" };
  }
}

const sinceOf = (unix: number) =>
  new Date(unix * 1000).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/** The welcome as one member gets it: the message and their card, ready to send or to look at. */
export async function renderWelcome({ tier, name, since, telegram, account }: {
  tier: PaidTier;
  name: Name | null;
  since: number;
  telegram: string | null;
  account: string;
}) {
  // The card is the flourish, not the point: if it can't be drawn, the welcome still goes.
  const card = await memberCard({ tier, name: name?.full ?? null, first: name?.first ?? null, since: sinceOf(since) }).catch((err) => {
    console.error("[membership] could not draw the member card, welcoming without it", err);
    return null;
  });
  return { ...welcomeEmail({ tier, name, telegram, account, card: card !== null }), card };
}

/**
 * WELCOME THE MEMBER WHO JUST FINISHED THIS CHECKOUT, ONCE.
 *
 * The session and its subscription are read fresh from Stripe. `base` is
 * where the email's links point: the public site for a live checkout, the
 * server that handled it for a test one (as with the delivery email).
 */
export async function welcomeMember(sessionId: string, origin: string, { force = false } = {}): Promise<Welcome> {
  const session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ["subscription.items.data.price"] });
  const sub = session.subscription as Stripe.Subscription | string | null;
  if (session.mode !== "subscription" || !sub || typeof sub === "string") return { status: "not-ours" };
  const tier = tierOfPrice(sub.items.data[0]?.price);
  if (!tier) return { status: "not-ours" };
  if (session.status !== "complete" || session.payment_status === "unpaid") return { status: "not-paid" };
  if (sub.metadata?.welcomed_at && !force) return { status: "already-sent" };

  const to = session.customer_details?.email;
  if (!to) return { status: "no-email" };

  const base = session.livemode ? SITE : origin;
  const telegram = (await sealedLink("telegram"))?.url ?? null;
  const name = memberName(session.customer_details?.name);
  const message = await renderWelcome({ tier, name, since: sub.start_date, telegram, account: `${base}${ACCOUNT_HREF}` });

  const sent = await send({ to, ...message, key: `welcome/${sub.id}` });

  // Bookkeeping. If it fails, the email has still gone.
  try {
    await stripe().subscriptions.update(sub.id, {
      metadata: { welcomed_at: new Date().toISOString(), welcome_email: sent.id.slice(0, 200) },
    });
  } catch (err) {
    console.warn("[membership] welcomed but could not stamp the subscription", sub.id, err);
  }
  return { status: "sent", ...sent };
}
