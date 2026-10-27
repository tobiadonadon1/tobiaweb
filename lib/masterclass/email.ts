import { accountsConfigured, adminClient, type Member } from "@/lib/account";
import { send } from "@/lib/membership/welcome";
import { productById } from "@/lib/shop/products";
import { lessonLinkFor, type LessonLink } from "./access";
import { clock, lessonForProduct } from "./lessons";

/**
 * THE LESSON, FOR A MEMBER WHO DOWNLOADS THE SKILL.
 *
 * A buyer gets the masterclass in their purchase email (lib/shop/deliver.ts).
 * A member whose plan includes the skill never buys it, so the first time
 * they download it they get this one instead: the lesson, where to watch it
 * (the Masterclass page with a plan, Drive without), and its chapters.
 * Once per member and skill: only when there is no earlier download.
 */

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function lessonEmail(productName: string, link: LessonLink) {
  const { lesson, href, poster, where } = link;
  const n = String(lesson.number).padStart(2, "0");
  const subject = `Your ${productName} masterclass`;
  const place = where === "site" ? "It's on the Masterclass page, with the rest of your plan" : "It's on Google Drive";
  const intro = `Thanks for downloading ${productName}. The masterclass that goes with it shows the whole thing in ${Math.round(lesson.seconds / 60)} minutes, from a raw clip to the finished reel. ${place}:`;
  const more = "More lessons are being filmed now. They go up on the Masterclass page first, never on YouTube.";

  const text = [
    "Hi,",
    "",
    intro,
    href,
    "",
    `Lesson ${n}: ${lesson.title} (${lesson.duration})`,
    ...lesson.chapters.map(([s, what]) => `  ${clock(s)}  ${what}`),
    "",
    more,
    "",
    "If anything doesn't work, reply to this email. It comes straight to me.",
    "",
    "Tobia",
  ].join("\n");

  const ink = "#0b1f3a";
  const soft = "rgba(11,31,58,0.62)";
  const font = "'Host Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif";
  const p = (s: string) => `<p style="margin:0 0 16px;font:400 16px/1.6 ${font};color:${ink};">${s}</p>`;
  const label = where === "site" ? "Watch it on the Masterclass" : "Watch the masterclass";

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(subject)}</title></head>
<body style="margin:0;padding:0;background:#faf8f2;">
<div style="display:none;max-height:0;overflow:hidden;">${escape(`Lesson ${n}: ${lesson.title}. ${lesson.duration}, start to finish.`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f2;"><tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
<tr><td>
<p style="margin:0 0 28px;font:400 12px/1 ${font};letter-spacing:0.14em;text-transform:uppercase;color:${soft};">Masterclass · Lesson ${n}</p>
${p("Hi,")}
${p(escape(intro))}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 28px;background:#0b0b0c;border-radius:16px;">
<tr><td style="padding:0;"><a href="${escape(href)}" style="display:block;text-decoration:none;"><img src="${escape(poster)}" width="520" alt="${escape(`Masterclass, lesson ${lesson.number}: ${lesson.title}`)}" style="display:block;width:100%;max-width:520px;height:auto;border:0;border-radius:16px 16px 0 0;"></a></td></tr>
<tr><td style="padding:22px 24px 24px;">
<p style="margin:0 0 6px;font:600 20px/1.25 ${font};color:#ffffff;">${escape(lesson.title)}</p>
<p style="margin:0 0 18px;font:400 14px/1.5 ${font};color:rgba(255,255,255,0.68);">Lesson ${n} · ${escape(lesson.duration)}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#ffffff;">
<a href="${escape(href)}" style="display:inline-block;padding:12px 22px;font:600 14px/1 ${font};color:#0b0b0c;text-decoration:none;border-radius:999px;">${escape(label)} &rarr;</a>
</td></tr></table>
</td></tr></table>
<p style="margin:0 0 8px;font:600 12px/1 ${font};letter-spacing:0.14em;text-transform:uppercase;color:${soft};">Chapters</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border-bottom:1px solid rgba(11,31,58,0.12);">
${lesson.chapters
  .map(
    ([s, what]) =>
      `<tr><td style="width:52px;padding:9px 0;border-top:1px solid rgba(11,31,58,0.12);font:500 13px/1.5 Menlo,Consolas,monospace;color:#b93a26;">${clock(s)}</td><td style="padding:9px 0;border-top:1px solid rgba(11,31,58,0.12);font:400 15px/1.5 ${font};color:${ink};">${escape(what)}</td></tr>`,
  )
  .join("\n")}
</table>
${p(escape(more))}
${p("If anything doesn't work, reply to this email. It comes straight to me.")}
${p("Tobia")}
</td></tr></table>
</td></tr></table>
</body></html>`;

  return { subject, html, text };
}

/**
 * Called by the member download, after the file is on its way. `first` is
 * whether this member had never downloaded the product before this one.
 * Best effort: a failure is logged, the download is never held up.
 */
export async function sendLessonOnFirstDownload(member: Member, productId: string, base: string, first: boolean) {
  if (!first || !lessonForProduct(productId)) return;
  const product = productById(productId);
  if (!product) return;
  try {
    const link = await lessonLinkFor(productId, { memberId: member.id, email: member.email }, base);
    if (!link) return;
    const message = lessonEmail(product.name, link);
    await send({ to: member.email, ...message, card: null, key: `lesson/${member.id}/${productId}` });
  } catch (err) {
    console.error("[masterclass] could not send the lesson email", member.id, productId, err);
  }
}

/** True when this member has no download of this product yet (asked before noting the new one). */
export async function neverDownloaded(member: Member, productId: string): Promise<boolean> {
  if (!accountsConfigured()) return false;
  try {
    const { count, error } = await adminClient()
      .from("downloads")
      .select("id", { count: "exact", head: true })
      .eq("member_id", member.id)
      .eq("product", productId);
    if (error) throw error;
    return (count ?? 0) === 0;
  } catch (err) {
    // Unknown is "no": a missed email beats a second one.
    console.error("[masterclass] could not count downloads", err);
    return false;
  }
}
