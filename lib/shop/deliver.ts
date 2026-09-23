import nodemailer from "nodemailer";
import { productFile } from "./file";
import { downloadHref, SHOP_EMAIL, thanksHref, type Product } from "./products";
import { ShopNotConfigured, stripe, type Purchase } from "./stripe";

/**
 * THE EMAIL WITH THE FILE IN IT.
 *
 * Sent from Tobia's own Gmail (SHOP_EMAIL), with the zip ATTACHED and a
 * download link underneath in case a mail client hides the attachment.
 * Replies go straight back to the same inbox, and every delivery sits in his
 * Sent folder.
 *
 * TWO WAYS OUT, chosen by what is configured:
 *
 *   Gmail SMTP   GMAIL_APP_PASSWORD is set (a Google "App Password", not the
 *                account password). The default. Gmail signs the message
 *                itself, so it lands in inboxes, and it allows about 500
 *                recipients a day on a personal account.
 *   Resend       RESEND_API_KEY is set and no Gmail password is. Kept as the
 *                fallback for a domain whose DNS can be edited.
 *
 * ONE SENDER. Only Stripe's webhook calls this. Gmail has no idempotency key,
 * so a second caller racing the webhook would be a second email. The webhook
 * is enough on its own: Stripe retries it for three days until it answers 200,
 * and the buyer already has the download on the thank-you page.
 *
 * Once sent, the PaymentIntent is stamped `delivered_at`, so a retried or
 * duplicated webhook skips a purchase that has already gone out.
 *
 * FAILING LOUDLY IS THE POINT. If the send fails this throws, the webhook
 * answers 500, and Stripe tries again later.
 */

const RESEND = "https://api.resend.com/emails";
const FROM_NAME = "Tobia Donadon";

export type Delivery =
  | { status: "sent"; id: string; via: "gmail" | "resend" }
  | { status: "already-sent" }
  | { status: "not-paid" }
  | { status: "no-email" };

type Message = {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachment: { filename: string; content: Buffer };
  sessionId: string;
  product: Product;
};

export function emailTransport(): "gmail" | "resend" | null {
  if (process.env.GMAIL_APP_PASSWORD) return "gmail";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

const sender = () => process.env.SHOP_EMAIL_FROM || SHOP_EMAIL;

async function viaGmail(msg: Message): Promise<string> {
  const user = sender();
  // Google shows App Passwords in four groups of four; the spaces are not part of it.
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 15_000,
    socketTimeout: 30_000,
  });
  const info = await transport.sendMail({
    from: { name: FROM_NAME, address: user },
    to: msg.to,
    replyTo: user,
    subject: msg.subject,
    text: msg.text,
    html: msg.html,
    attachments: [{ filename: msg.attachment.filename, content: msg.attachment.content, contentType: "application/zip" }],
  });
  if (!info.accepted?.length) {
    throw new Error(`Gmail did not accept the delivery email: ${info.response ?? "no response"}`);
  }
  return info.messageId;
}

async function viaResend(msg: Message): Promise<string> {
  const res = await fetch(RESEND, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `delivery/${msg.sessionId}`,
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${sender()}>`,
      to: [msg.to],
      reply_to: sender(),
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      attachments: [{ filename: msg.attachment.filename, content: msg.attachment.content.toString("base64") }],
      tags: [{ name: "product", value: msg.product.id.replace(/[^\w-]/g, "_") }],
    }),
    signal: AbortSignal.timeout(20_000),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!res.ok || !body.id) {
    throw new Error(`Resend refused the delivery email (${res.status}): ${body.message ?? "no message"}`);
  }
  return body.id;
}

export async function deliver(purchase: Purchase, origin: string): Promise<Delivery> {
  if (!purchase.paid) return { status: "not-paid" };
  if (!purchase.email) return { status: "no-email" };
  if (purchase.paymentIntent?.metadata?.delivered_at) return { status: "already-sent" };

  const via = emailTransport();
  if (!via) throw new ShopNotConfigured("GMAIL_APP_PASSWORD");

  const { subject, html, text } = deliveryEmail(purchase, origin);
  const msg: Message = {
    to: purchase.email,
    subject,
    html,
    text,
    attachment: { filename: purchase.product.file.filename, content: await productFile(purchase.product) },
    sessionId: purchase.session.id,
    product: purchase.product,
  };

  const id = via === "gmail" ? await viaGmail(msg) : await viaResend(msg);

  // The stamp is bookkeeping. If it fails, the email has still gone.
  if (purchase.paymentIntent) {
    try {
      await stripe().paymentIntents.update(purchase.paymentIntent.id, {
        metadata: { delivered_at: new Date().toISOString(), delivery_email: id.slice(0, 200), delivery_via: via },
      });
    } catch (err) {
      console.warn("[shop] delivered but could not stamp the payment", err);
    }
  }

  return { status: "sent", id, via };
}

/* ------------------------------------------------------------------ *
 * THE MESSAGE.
 *
 * Written like a note from a person, because it is one: it comes from Tobia's
 * address and a reply reaches him. The zip is attached; one button links to
 * the same file, then the three steps, then what to do if something breaks.
 * Most people buy from a phone and the folder is only useful on a computer,
 * so the email says where to open it.
 * ------------------------------------------------------------------ */

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function deliveryEmail(purchase: Purchase, origin: string) {
  const { product, session } = purchase;
  const download = `${origin}${downloadHref(session.id)}`;
  const guide = `${origin}${thanksHref(product)}?session_id=${encodeURIComponent(session.id)}`;
  const first = purchase.name?.trim().split(/\s+/)[0];
  const hello = first ? `Hi ${first},` : "Hi,";
  const file = product.file.filename;

  const subject = `Your copy of ${product.name}`;

  const text = [
    hello,
    "",
    `Thanks for buying ${product.name}. Your copy is attached (${file}).`,
    "If your email app hides the attachment, download it here:",
    download,
    "",
    "Open it on the computer you will run it on:",
    "1. Unzip the folder and put it somewhere you'll keep, like Documents.",
    "2. Open a terminal in the folder and type: claude",
    "3. Type: hi",
    "",
    "Claude takes it from there. It installs what the bot needs, helps you create your one TypeSafe key, runs the first scan and schedules it for every day. About ten minutes.",
    "",
    "It starts on paper money, on real prices. It only suggests real trades after it passes its go-live checklist, and you place every one yourself.",
    "",
    "If anything doesn't work, reply to this email. It comes straight to me.",
    "",
    "Tobia",
    "",
    "",
    `The download link is yours and keeps working. The setup steps are also here: ${guide}`,
    "Not financial advice.",
  ].join("\n");

  const ink = "#0b1f3a";
  const soft = "rgba(11,31,58,0.66)";
  // The darker clay: paper on it passes AA, which the lighter fill does not.
  const clay = "#b93a26";
  const font = "'Host Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif";
  const p = (s: string) =>
    `<p style="margin:0 0 16px;font:400 16px/1.6 ${font};color:${ink};">${s}</p>`;
  const step = (n: number, s: string) =>
    `<tr><td style="padding:10px 14px 10px 0;vertical-align:top;font:500 13px/1.6 ${font};color:${clay};">${n}</td><td style="padding:10px 0;border-top:1px solid rgba(11,31,58,0.12);font:400 15px/1.6 ${font};color:${ink};">${s}</td></tr>`;
  const code = (s: string) =>
    `<span style="font-family:Menlo,Consolas,monospace;font-size:14px;background:#f1ede4;padding:2px 6px;border-radius:4px;">${s}</span>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(subject)}</title></head>
<body style="margin:0;padding:0;background:#faf8f2;">
<div style="display:none;max-height:0;overflow:hidden;">Your copy is attached. Unzip it, open it in Claude Code, type hi.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f2;"><tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
<tr><td>
<p style="margin:0 0 28px;font:400 12px/1 ${font};letter-spacing:0.14em;text-transform:uppercase;color:${soft};">${escape(product.name)} · ${escape(product.priceLabel)} · Paid</p>
${p(escape(hello))}
${p(`Thanks for buying ${escape(product.name)}. Your copy is attached as <strong style="font-weight:500;">${escape(file)}</strong>.`)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 12px;"><tr><td style="border-radius:999px;background:${clay};">
<a href="${escape(download)}" style="display:inline-block;padding:14px 26px;font:500 15px/1 ${font};color:#faf8f2;text-decoration:none;border-radius:999px;">Download ${escape(product.name)}</a>
</td></tr></table>
<p style="margin:0 0 28px;font:400 13px/1.5 ${font};color:${soft};">The same file, in case your email app hides the attachment.</p>
${p(`<span style="color:${soft};">Open it on the computer you will run it on:</span>`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-bottom:1px solid rgba(11,31,58,0.12);">
${step(1, "Unzip the folder and put it somewhere you'll keep, like Documents.")}
${step(2, `Open a terminal in the folder and type ${code("claude")}`)}
${step(3, `Type ${code("hi")}`)}
</table>
${p("Claude takes it from there. It installs what the bot needs, helps you create your one TypeSafe key, runs the first scan and schedules it for every day. About ten minutes.")}
${p("It starts on paper money, on real prices. It only suggests real trades after it passes its go-live checklist, and you place every one yourself.")}
${p("If anything doesn't work, reply to this email. It comes straight to me.")}
${p("Tobia")}
<p style="margin:32px 0 0;padding-top:20px;border-top:1px solid rgba(11,31,58,0.12);font:400 13px/1.6 ${font};color:${soft};">The download link is yours and keeps working. The setup steps are also <a href="${escape(guide)}" style="color:${soft};">on this page</a>. Not financial advice.</p>
</td></tr></table>
</td></tr></table>
</body></html>`;

  return { subject, html, text };
}
