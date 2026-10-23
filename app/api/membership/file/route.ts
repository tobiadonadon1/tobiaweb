import { currentMember } from "@/lib/account";
import { ACCOUNT_HREF, JOIN_HREF } from "@/components/account/links";
import { membershipOf } from "@/lib/membership/server";
import { trainingReach } from "@/lib/membership/tiers";
import { originFor } from "@/lib/shop/stripe";
import { sheetFile } from "@/lib/training/file";
import { sheetById } from "@/lib/training/sheets";

/**
 * GET /api/membership/file?id=<sheet>              the PDF, opened in the browser
 * GET /api/membership/file?id=<sheet>&download=1   the PDF, saved
 * GET /api/membership/file?id=<sheet>&picture=1    its page picture (the dashboard's card)
 *
 * A training sheet (lib/training/sheets.ts), for a member whose plan reaches
 * it. It's a link people click, so every refusal is a page, not JSON:
 * signed out → sign in and come back; a plan that doesn't reach it → the plans.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = originFor(request);
  const params = new URL(request.url).searchParams;
  const sheet = sheetById(params.get("id"));
  if (!sheet) return new Response("Not found", { status: 404 });

  const { member, cookies } = await currentMember(request);
  const here = `/api/membership/file?id=${sheet.id}`;
  const go = (to: string) => {
    const headers = new Headers({ location: `${origin}${to}` });
    for (const c of cookies) headers.append("set-cookie", c);
    return new Response(null, { status: 303, headers });
  };
  if (!member) return go(`${ACCOUNT_HREF}?mode=signin&next=${encodeURIComponent(here)}`);
  const { tier } = await membershipOf(member);
  if (!trainingReach(tier).includes(sheet.tier)) return go(`${JOIN_HREF}#${sheet.tier}`);

  try {
    if (params.get("picture") === "1") {
      const picture = await sheetFile(sheet.id, "webp");
      const headers = new Headers({ "content-type": "image/webp", "cache-control": "private, max-age=3600", "x-robots-tag": "noindex" });
      for (const c of cookies) headers.append("set-cookie", c);
      return new Response(new Uint8Array(picture), { headers });
    }
    const pdf = await sheetFile(sheet.id);
    const headers = new Headers({
      "content-type": "application/pdf",
      "content-length": String(pdf.length),
      "content-disposition": `${params.get("download") === "1" ? "attachment" : "inline"}; filename="${sheet.id}.pdf"`,
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    });
    for (const c of cookies) headers.append("set-cookie", c);
    return new Response(new Uint8Array(pdf), { headers });
  } catch (err) {
    console.error("[training] could not read a sheet", err);
    return new Response("This sheet didn't load. Try again in a minute, or email tobia@donadon.com.", { status: 500 });
  }
}
