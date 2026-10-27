import { after } from "next/server";
import { currentMember, noteDownload } from "@/lib/account";
import { JOIN_HREF } from "@/components/account/links";
import { lessonForProduct } from "@/lib/masterclass/lessons";
import { neverDownloaded, sendLessonOnFirstDownload } from "@/lib/masterclass/email";
import { membershipOf, owns } from "@/lib/membership/server";
import { offer } from "@/lib/membership/tiers";
import { productFile, storedLink } from "@/lib/shop/file";
import { verifyFree, verifyGift } from "@/lib/shop/free";
import { fileType, productById, thanksHref, THE_98C_TRADE, type Product } from "@/lib/shop/products";
import { findPurchase, originFor } from "@/lib/shop/stripe";
import { SITE } from "@/lib/site";

/**
 * GET /api/download?session_id=cs_…
 *
 * The buyer's copy. The session id IS the receipt: it is unguessable, Stripe
 * vouches for it on every request, and it is what the thank-you page and the
 * email both link with. No accounts, no passwords, no expiring tokens to
 * chase — the link in the email keeps working for as long as the payment
 * exists.
 *
 * ANYTHING WRONG GOES TO THE THANK-YOU PAGE, which runs the same check and
 * explains the answer in words: still processing, not found, or "email me".
 * A buyer never sees a bare error from this route.
 *
 * GET /api/download?product=…&member=1   (a member's copy)
 *
 * For a signed-in member whose plan includes the skill, or who bought it
 * (on the account, or before it with the same address). Anyone else goes
 * back to the skill's page, or to the plans for an Ultimate-only skill.
 *
 * GET /api/download?product=…&e=…&t=…   (something given away)
 * GET /api/download?product=…&e=…&g=…   (a paid product Tobia gifted)
 *
 * The link in a free product's email: the address it was sent to and a
 * signature over it (lib/shop/free.ts). A bad or missing signature goes back
 * to the product's page, where the address can be left again.
 */

export const dynamic = "force-dynamic";

/** The file itself, or for a stored one (too big to send from here) a short-lived link to it. */
async function hand(product: Product) {
  if (product.file.stored) {
    return new Response(null, {
      status: 303,
      headers: { Location: await storedLink(product), "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
    });
  }
  return serve(await productFile(product), product);
}

function serve(bytes: Buffer, product: Product) {
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": fileType(product),
      "Content-Length": String(bytes.length),
      "Content-Disposition": `attachment; filename="${product.file.filename}"`,
      // Somebody's copy, not a public asset: no shared caches.
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

export async function GET(request: Request) {
  const origin = originFor(request);
  const params = new URL(request.url).searchParams;

  const free = productById(params.get("product"));

  if (free && !free.free && params.get("member") === "1") {
    const { member } = await currentMember(request);
    const { tier } = await membershipOf(member);
    const deal = offer(free, tier);
    if (!member) return Response.redirect(`${origin}${free.href}#buy`, 303);
    if (deal.kind === "included" || (await owns(member, free.id))) {
      try {
        const res = await hand(free);
        // A skill with a masterclass lesson: the first download brings it by
        // email (lib/masterclass/email.ts), after the file is on its way.
        const first = lessonForProduct(free.id) ? await neverDownloaded(member, free.id) : false;
        await noteDownload(member, free.id);
        if (first) {
          const base = origin.includes("localhost") ? origin : SITE;
          after(() => sendLessonOnFirstDownload(member, free.id, base, true));
        }
        return res;
      } catch (err) {
        console.error("[shop] download: could not read the member's product file", err);
        return Response.redirect(`${origin}${free.href}?checkout=error#buy`, 303);
      }
    }
    if (deal.kind === "locked") return Response.redirect(`${origin}${JOIN_HREF}?for=${free.id}#${deal.needs}`, 303);
    return Response.redirect(`${origin}${free.href}#buy`, 303);
  }

  if (free?.free) {
    if (!verifyFree(free, params.get("e") ?? "", params.get("t") ?? "")) {
      return Response.redirect(`${origin}${free.href}#claim`, 303);
    }
    try {
      return await hand(free);
    } catch (err) {
      console.error("[shop] download: could not read the free product file", err);
      return Response.redirect(`${origin}${free.href}#claim`, 303);
    }
  }

  // A paid product Tobia gave someone: signed for their address (free.ts).
  if (free && params.has("g")) {
    if (!verifyGift(free, params.get("e") ?? "", params.get("g") ?? "")) {
      return Response.redirect(`${origin}${free.href}`, 303);
    }
    try {
      return await hand(free);
    } catch (err) {
      console.error("[shop] download: could not read the gifted product file", err);
      return Response.redirect(`${origin}${free.href}`, 303);
    }
  }

  const sessionId = params.get("session_id") ?? "";

  let purchase;
  try {
    purchase = await findPurchase(sessionId);
  } catch (err) {
    console.error("[shop] download: could not check the purchase", err);
    purchase = null;
  }

  const back = (product = THE_98C_TRADE, reason?: string) => {
    const q = new URLSearchParams({ session_id: sessionId });
    if (reason) q.set("download", reason);
    return Response.redirect(`${origin}${thanksHref(product)}?${q}`, 303);
  };

  if (!purchase || !purchase.paid) return back(purchase?.product);

  try {
    return await hand(purchase.product);
  } catch (err) {
    console.error("[shop] download: could not read the product file", err);
    return back(purchase.product, "failed");
  }
}
