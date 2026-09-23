import { productFile } from "@/lib/shop/file";
import { thanksHref, THE_98C_TRADE } from "@/lib/shop/products";
import { findPurchase, originFor } from "@/lib/shop/stripe";

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
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = originFor(request);
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";

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
    const bytes = await productFile(purchase.product);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(bytes.length),
        "Content-Disposition": `attachment; filename="${purchase.product.file.filename}"`,
        // Somebody's purchase, not a public asset: no shared caches.
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (err) {
    console.error("[shop] download: could not read the product file", err);
    return back(purchase.product, "failed");
  }
}
