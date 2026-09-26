import Stripe from "stripe";
import { productById, thanksHref, type Product } from "@/lib/shop/products";
import { originFor, stripe } from "@/lib/shop/stripe";

/**
 * POST /api/checkout
 *
 * The buy button is a plain HTML form that posts here, and this answers with
 * a 303 to Stripe's hosted checkout. A form rather than a Server Action on
 * purpose: an action's id changes with every deployment, so somebody who
 * opened the page before a deploy and pressed Buy after it would get an error
 * instead of a checkout. A form posting to a fixed URL works across deploys,
 * and it works with JavaScript switched off.
 *
 * ANY FAILURE LANDS BACK ON THE PAGE, never on a JSON error. The product page
 * reads `?checkout=error` and tells the buyer, in words, what to do.
 */

export const dynamic = "force-dynamic";

function sessionParams(product: Product, origin: string): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: product.priceCents,
          product: product.stripeProductId,
        },
      },
    ],
    // A real Customer per buyer, so the dashboard has a list of who bought
    // what, ready for the next product.
    customer_creation: "always",
    submit_type: "pay",
    success_url: `${origin}${thanksHref(product)}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${product.href}`,
    metadata: { product: product.id },
    payment_intent_data: {
      description: product.name,
      metadata: { product: product.id },
    },
    custom_text: {
      submit: {
        message:
          "The download opens on the next page, and a copy of the link goes to your email.",
      },
    },
  };
}

/**
 * THE PRODUCT IN STRIPE, CREATED ON FIRST USE.
 *
 * Every sale is attached to one Stripe product with a fixed id, so the
 * dashboard reads "The 98¢ Trade: 40 sold" rather than forty one-off
 * products. Nobody has to remember to create it: the first checkout that
 * finds it missing creates it and tries again.
 */
async function ensureProduct(product: Product, origin: string) {
  const image = `${origin}/shop/${product.id}.png`;
  try {
    await stripe().products.create({
      id: product.stripeProductId,
      name: product.name,
      description: product.description,
      // Stripe fetches the image itself, so it has to be a public URL.
      ...(origin.startsWith("https://") ? { images: [image] } : {}),
    });
  } catch (err) {
    // Two first buyers in the same second both find it missing; the second
    // create loses the race, and the product it wanted now exists.
    const exists =
      err instanceof Stripe.errors.StripeInvalidRequestError &&
      err.code === "resource_already_exists";
    if (!exists) throw err;
  }
}

async function createSession(product: Product, origin: string) {
  const params = sessionParams(product, origin);
  try {
    return await stripe().checkout.sessions.create(params);
  } catch (err) {
    const missing =
      err instanceof Stripe.errors.StripeInvalidRequestError &&
      err.code === "resource_missing" &&
      (err.param ?? "").includes("product");
    if (!missing) throw err;
    await ensureProduct(product, origin);
    return await stripe().checkout.sessions.create(params);
  }
}

export async function POST(request: Request) {
  const origin = originFor(request);
  const form = await request.formData().catch(() => null);
  const product = productById(form?.get("product"));

  if (!product) {
    return Response.redirect(`${origin}/projects/construct/material/setups`, 303);
  }
  // Given away, not sold: never open a checkout for it.
  if (product.free) {
    return Response.redirect(`${origin}${product.href}`, 303);
  }

  try {
    const session = await createSession(product, origin);
    if (!session.url) throw new Error("Stripe returned a session without a URL");
    return Response.redirect(session.url, 303);
  } catch (err) {
    console.error("[shop] checkout failed", err);
    return Response.redirect(`${origin}${product.href}?checkout=error#buy`, 303);
  }
}
