import { accountsConfigured, adminClient, type Member } from "@/lib/account";
import { membershipOf } from "@/lib/membership/server";
import { hasPerk } from "@/lib/membership/tiers";
import { driveLinks } from "./drive";
import { lessonForProduct, lessonHref, type Lesson } from "./lessons";

/**
 * WHERE A BUYER WATCHES THE LESSON THAT COMES WITH A SKILL.
 *
 * Tobia, 2026-10-27: someone with a plan gets the Masterclass page (the
 * lesson is there, with the rest); someone who only bought the skill gets
 * the Drive copy. The buyer is the account the checkout was made from, or
 * failing that an account with the same address.
 */
export type LessonLink = {
  lesson: Lesson;
  href: string;
  where: "site" | "drive";
  /** The cover, as an absolute address (emails can't load a relative one). */
  poster: string;
};

export async function lessonLinkFor(
  productId: string,
  buyer: { memberId?: string | null; email?: string | null },
  base: string,
): Promise<LessonLink | null> {
  const lesson = lessonForProduct(productId);
  if (!lesson) return null;
  const poster = `${base}${lesson.emailPoster}`;
  const drive = (await driveLinks())[productId];
  const site = { lesson, href: `${base}${lessonHref(lesson)}`, where: "site" as const, poster };
  if (!drive) return site;
  const onDrive = { lesson, href: drive, where: "drive" as const, poster };

  const member = await memberOf(buyer);
  if (!member) return onDrive;
  const { tier } = await membershipOf(member);
  return hasPerk(tier, "masterclass") ? site : onDrive;
}

async function memberOf({ memberId, email }: { memberId?: string | null; email?: string | null }): Promise<Member | null> {
  if (!accountsConfigured()) return null;
  try {
    const db = adminClient().from("members").select("id, email");
    const { data } = memberId
      ? await db.eq("id", memberId).maybeSingle()
      : email
        ? await db.eq("email", email.toLowerCase()).maybeSingle()
        : { data: null };
    return (data as Member | null) ?? null;
  } catch (err) {
    console.error("[masterclass] could not look up the buyer", err);
    return null;
  }
}
