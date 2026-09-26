import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";
import { productFile } from "./file";
import { freeLink } from "./free";
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
 * WHEN THE ZIP CANNOT TRAVEL. Gmail refuses a message outright (552 5.7.0)
 * when a zip holds a script file, and refuses one that is too big. When the
 * server refuses the attachment, the same email goes again with the link
 * only. A refused message was never delivered, so the second send is still
 * the buyer's only email.
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
  attachment?: { filename: string; content: Buffer };
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
    attachments: msg.attachment
      ? [{ filename: msg.attachment.filename, content: msg.attachment.content, contentType: "application/zip" }]
      : [],
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
      // A link-only resend is a different message, so it needs its own key.
      "Idempotency-Key": `delivery/${msg.sessionId}${msg.attachment ? "" : "/link"}`,
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${sender()}>`,
      to: [msg.to],
      reply_to: sender(),
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      attachments: msg.attachment
        ? [{ filename: msg.attachment.filename, content: msg.attachment.content.toString("base64") }]
        : undefined,
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

  const to = purchase.email;
  const send = async (attached: boolean) => {
    const msg: Message = {
      to,
      ...deliveryEmail(purchase, origin, { attached }),
      attachment: attached
        ? { filename: purchase.product.file.filename, content: await productFile(purchase.product) }
        : undefined,
      sessionId: purchase.session.id,
      product: purchase.product,
    };
    return via === "gmail" ? viaGmail(msg) : viaResend(msg);
  };

  let file: "attached" | "link" = purchase.product.file.attach === false ? "link" : "attached";
  let id: string;
  try {
    id = await send(file === "attached");
  } catch (err) {
    if (file === "link" || !refusedAttachment(err)) throw err;
    console.warn("[shop] the mail server refused the attachment, sending the link instead", err);
    file = "link";
    id = await send(false);
  }

  // The stamp is bookkeeping. If it fails, the email has still gone.
  if (purchase.paymentIntent) {
    try {
      await stripe().paymentIntents.update(purchase.paymentIntent.id, {
        metadata: {
          delivered_at: new Date().toISOString(),
          delivery_email: id.slice(0, 200),
          delivery_via: via,
          delivery_file: file,
        },
      });
    } catch (err) {
      console.warn("[shop] delivered but could not stamp the payment", err);
    }
  }

  return { status: "sent", id, via };
}

/** A refusal about the message's content or size (SMTP 552), not the connection. */
function refusedAttachment(err: unknown): boolean {
  const e = err as { responseCode?: number; message?: string } | null;
  return e?.responseCode === 552 || /\b552\b|attachment/i.test(e?.message ?? "");
}

/* ------------------------------------------------------------------ *
 * THE MESSAGE.
 *
 * Written like a note from a person, because it is one: it comes from Tobia's
 * address and a reply reaches him. The zip is attached (or, where the mail
 * server refuses it, only linked); one button links to the file, then the
 * three steps, then what to do if something breaks.
 * Most people buy from a phone and the folder is only useful on a computer,
 * so the email says where to open it.
 * ------------------------------------------------------------------ */

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * WHERE THE EMAIL'S LINKS POINT.
 *
 * A real purchase always links to the public site, whatever server happened
 * to handle the webhook: a buyer's email must never carry a localhost or
 * preview address, because the link has to keep working for as long as they
 * keep the email. Only a test-mode purchase links back to the copy of the
 * site that processed it, since the public site runs on live keys and cannot
 * see test purchases. (The first sandbox run linked to localhost for exactly
 * this reason, and it looked like a broken download.)
 */
export function emailBase(purchase: Purchase, origin: string): string {
  return purchase.session.livemode ? SITE : origin;
}

export function deliveryEmail(
  purchase: Purchase,
  origin: string,
  { attached = purchase.product.file.attach !== false }: { attached?: boolean } = {},
) {
  const { product, session } = purchase;
  const base = emailBase(purchase, origin);
  return renderEmail({
    product,
    download: `${base}${downloadHref(session.id)}`,
    guide: `${base}${thanksHref(product)}?session_id=${encodeURIComponent(session.id)}`,
    attached,
    free: false,
  });
}

/**
 * THE SAME EMAIL, FOR SOMETHING GIVEN AWAY. Same template, same steps, same
 * sign-off; it says "here it is" instead of "thanks for buying", and its link
 * is signed for the address rather than tied to a payment (see free.ts).
 * `base` is the public site for real requests, so the link keeps working.
 */
export function freeEmail(product: Product, to: string, base: string) {
  return renderEmail({
    product,
    download: freeLink(base, product, to),
    guide: `${base}${product.href}`,
    attached: false,
    free: true,
  });
}

/** Send a free product to an address. Throws if the mail server refuses. */
export async function sendFree(product: Product, to: string, base: string) {
  const via = emailTransport();
  if (!via) throw new ShopNotConfigured("GMAIL_APP_PASSWORD");
  const msg: Message = {
    to,
    ...freeEmail(product, to, base),
    // Resend's idempotency key: a double click within the minute sends once.
    sessionId: `free/${product.id}/${to.toLowerCase()}/${Math.floor(Date.now() / 60_000)}`,
    product,
  };
  const id = via === "gmail" ? await viaGmail(msg) : await viaResend(msg);
  return { id, via };
}

function renderEmail({
  product,
  download,
  guide,
  attached,
  free,
}: {
  product: Product;
  download: string;
  guide: string;
  attached: boolean;
  free: boolean;
}) {
  // Plain "Hi," for everyone. The name typed at checkout is often a card
  // name, a company or a test fixture ("Jenny"), and a wrong name reads worse
  // than none.
  const hello = "Hi,";
  const file = product.file.filename;
  const { steps, email } = product;

  const subject = `Your copy of ${product.name}`;

  const text = [
    hello,
    "",
    ...(attached
      ? [
          `Thanks for buying ${product.name}. Your copy is attached (${file}).`,
          "If your email app hides the attachment, download it here:",
        ]
      : [
          free
            ? `Here's ${product.name}, as promised. Download your copy (${file}) here:`
            : `Thanks for buying ${product.name}. Download your copy (${file}) here:`,
        ]),
    download,
    "",
    "Open it on the computer you will run it on:",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    ...email.after.flatMap((para) => [para, ""]),
    "If anything doesn't work, reply to this email. It comes straight to me.",
    "",
    "Tobia",
    "",
    "",
    `The download link is yours and keeps working. The setup steps are also here: ${guide}`,
    ...(email.footnote ? [email.footnote] : []),
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
  // What the buyer types, set as code: the lowercase commands only, so
  // "Claude Code" in a sentence is left alone.
  const commands = (s: string) =>
    escape(s).replace(/(^|\s)(claude|hi|\/[a-z-]+)(?=[\s.,]|$)/g, (_, pre, cmd) => `${pre}${code(cmd)}`);

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(subject)}</title></head>
<body style="margin:0;padding:0;background:#faf8f2;">
<div style="display:none;max-height:0;overflow:hidden;">${attached ? "Your copy is attached." : "Your download is inside."} Unzip it, open it in Claude Code, type hi.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f2;"><tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
<tr><td>
<p style="margin:0 0 28px;font:400 12px/1 ${font};letter-spacing:0.14em;text-transform:uppercase;color:${soft};">${escape(product.name)} · ${free ? "Free" : `${escape(product.priceLabel)} · Paid`}</p>
${p(escape(hello))}
${p(
  attached
    ? `Thanks for buying ${escape(product.name)}. Your copy is attached as <strong style="font-weight:500;">${escape(file)}</strong>.`
    : free
      ? `Here's ${escape(product.name)}, as promised. Your copy is one click away.`
      : `Thanks for buying ${escape(product.name)}. Your copy is one click away.`,
)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 12px;"><tr><td style="border-radius:999px;background:${clay};">
<a href="${escape(download)}" style="display:inline-block;padding:14px 26px;font:500 15px/1 ${font};color:#faf8f2;text-decoration:none;border-radius:999px;">Download ${escape(product.name)}</a>
</td></tr></table>
<p style="margin:0 0 28px;font:400 13px/1.5 ${font};color:${soft};">${
  attached
    ? "The same file, in case your email app hides the attachment."
    : `It saves as <strong style="font-weight:500;">${escape(file)}</strong>.`
}</p>
${p(`<span style="color:${soft};">Open it on the computer you will run it on:</span>`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-bottom:1px solid rgba(11,31,58,0.12);">
${steps.map((s, i) => step(i + 1, commands(s))).join("\n")}
</table>
${email.after.map((para) => p(commands(para))).join("\n")}
${p("If anything doesn't work, reply to this email. It comes straight to me.")}
${p("Tobia")}
<p style="margin:32px 0 0;padding-top:20px;border-top:1px solid rgba(11,31,58,0.12);font:400 13px/1.6 ${font};color:${soft};">The download link is yours and keeps working. The setup steps are also <a href="${escape(guide)}" style="color:${soft};">on this page</a>.${email.footnote ? ` ${escape(email.footnote)}` : ""}</p>
</td></tr></table>
</td></tr></table>
</body></html>`;

  return { subject, html, text };
}
