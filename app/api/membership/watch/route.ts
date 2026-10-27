import { adminClient, currentMember } from "@/lib/account";
import { lessonBySlug } from "@/lib/masterclass/lessons";
import { membershipOf, owns } from "@/lib/membership/server";
import { hasPerk } from "@/lib/membership/tiers";

/**
 * GET /api/membership/watch?v=<lesson slug>
 *
 * The Masterclass player's source: a signed link to the lesson in the
 * private bucket, good for four hours (the player asks again if it runs
 * out). Only for a member whose plan opens the Masterclass, or who bought the
 * skill the lesson comes with. Everyone else gets `locked` and the page shows
 * the way in instead.
 *
 *   200 { ok: true, src }      play it
 *   401 { error: "sign-in" }   no account (the page itself is behind proxy.ts)
 *   403 { error: "locked" }    an account without the plan or the skill
 *   404 { error: "no-lesson" }
 */

export const dynamic = "force-dynamic";

const HOURS = 4;

export async function GET(request: Request) {
  const { member, cookies } = await currentMember(request);
  const headers = new Headers({ "content-type": "application/json", "cache-control": "private, no-store" });
  for (const c of cookies) headers.append("set-cookie", c);
  const json = (body: object, status = 200) => new Response(JSON.stringify(body), { status, headers });

  const lesson = lessonBySlug(new URL(request.url).searchParams.get("v"));
  if (!lesson) return json({ ok: false, error: "no-lesson" }, 404);
  if (!member) return json({ ok: false, error: "sign-in" }, 401);

  const { tier } = await membershipOf(member);
  const open = hasPerk(tier, "masterclass") || (lesson.product ? await owns(member, lesson.product) : false);
  if (!open) return json({ ok: false, error: "locked" }, 403);

  const { data, error } = await adminClient().storage.from("products").createSignedUrl(lesson.stored, HOURS * 3600);
  if (error || !data?.signedUrl) {
    console.error("[masterclass] could not sign the lesson", lesson.slug, error);
    return json({ ok: false, error: "failed" }, 500);
  }
  return json({ ok: true, src: data.signedUrl });
}
