import { productFile } from "@/lib/shop/file";
import { verifyFree } from "@/lib/shop/free";
import { productById, thanksHref, THE_98C_TRADE, type Product } from "@/lib/shop/products";
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
 *
 * GET /api/download?product=…&e=…&t=…   (something given away)
 *
 * The link in a free product's email: the address it was sent to and a
 * signature over it (lib/shop/free.ts). A bad or missing signature goes back
 * to the product's page, where the address can be left again.
 */

export const dynamic = "force-dynamic";

function serve(bytes: Buffer, product: Product) {
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/zip",
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
  if (free?.free) {
    if (!verifyFree(free, params.get("e") ?? "", params.get("t") ?? "")) {
      return Response.redirect(`${origin}${free.href}#claim`, 303);
    }
    try {
      return serve(await productFile(free), free);
    } catch (err) {
      console.error("[shop] download: could not read the free product file", err);
      return Response.redirect(`${origin}${free.href}#claim`, 303);
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
    return serve(await productFile(purchase.product), purchase.product);
  } catch (err) {
    console.error("[shop] download: could not read the product file", err);
    return back(purchase.product, "failed");
  }
}
