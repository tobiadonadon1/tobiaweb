import nodemailer from "nodemailer";
import { SHOP_EMAIL } from "@/lib/shop/products";

/**
 * A NOTE TO TOBIA: a commission, a Universal enquiry. Sent from and to his
 * Gmail, with the person's address as Reply-To so answering is one tap.
 * Best effort: the row in the database is the record, so a send that fails
 * is logged and the person still gets "sent".
 */
export async function notifyTobia(subject: string, text: string, replyTo: string) {
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
  if (!pass) return false;
  const user = process.env.SHOP_EMAIL_FROM || SHOP_EMAIL;
  try {
    await nodemailer
      .createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass }, connectionTimeout: 15_000 })
      .sendMail({ from: `Construct <${user}>`, to: user, replyTo, subject, text });
    return true;
  } catch (err) {
    console.error("[membership] could not email Tobia", err);
    return false;
  }
}
