import { currentMember } from "@/lib/account";
import { DESIGN_MANIFEST } from "@/components/design-library/manifest.generated";
import { designFile } from "@/lib/design/files";
import { membershipOf } from "@/lib/membership/server";
import { hasPerk } from "@/lib/membership/tiers";

/**
 * GET /api/design/source?slug=<block>              { ok, source, filename }
 * GET /api/design/source?slug=<block>&download=1   the .tsx file
 * GET /api/design/source?all=1                     every block, zipped
 *
 * The readable code of the Design library. Anyone can play with a block on
 * the page (the preview is compiled and minified); its source is handed out
 * here, and only here, after the plan check:
 *
 *   a block marked free     any signed-in account, Free included
 *   every other block       Pro and up (the `design` perk)
 *   the whole library zip   Pro and up
 *
 * Refusals are JSON the page reads to say the right thing: "sign-in" (no
 * account yet) or "plan" (an account whose plan doesn't open it).
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const slug = params.get("slug") ?? "";
  const all = params.get("all") === "1";
  const block = Object.hasOwn(DESIGN_MANIFEST, slug) ? DESIGN_MANIFEST[slug] : null;

  const { member, cookies } = await currentMember(request);
  const headers = new Headers({ "cache-control": "private, no-store", "x-robots-tag": "noindex" });
  for (const c of cookies) headers.append("set-cookie", c);
  const refuse = (status: number, error: string) => {
    headers.set("content-type", "application/json");
    return new Response(JSON.stringify({ ok: false, error }), { status, headers });
  };

  if (!all && !block) return refuse(404, "not-found");
  if (!member) return refuse(401, "sign-in");
  const { tier } = await membershipOf(member);
  const open = hasPerk(tier, "design") || (!all && block?.free);
  if (!open) return refuse(403, "plan");

  try {
    if (all) {
      const zip = await designFile("construct-design.zip");
      headers.set("content-type", "application/zip");
      headers.set("content-disposition", 'attachment; filename="construct-design.zip"');
      return new Response(new Uint8Array(zip), { headers });
    }
    const source = (await designFile(`${slug}.tsx`)).toString("utf8");
    const filename = `${slug}.tsx`;
    if (params.get("download") === "1") {
      headers.set("content-type", "text/plain; charset=utf-8");
      headers.set("content-disposition", `attachment; filename="${filename}"`);
      return new Response(source, { headers });
    }
    headers.set("content-type", "application/json");
    return new Response(JSON.stringify({ ok: true, source, filename }), { headers });
  } catch (err) {
    console.error("[design] could not read a sealed design file", err);
    return refuse(500, "failed");
  }
}
