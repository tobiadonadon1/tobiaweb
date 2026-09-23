import Stripe from "stripe";
import { SITE } from "@/lib/site";
import { productById, type Product } from "./products";

/**
 * STRIPE, AND THE ONE QUESTION THE SHOP ASKS OF IT.
 *
 * There is no database. Stripe already keeps a record of every purchase —
 * who paid, how much, when, and for what — and a second copy of that record
 * is a second thing that can disagree with the first. So the shop asks Stripe
 * directly: "is this checkout session real, paid, and for a product I sell?"
 * The download, the thank-you page and the webhook all ask it the same way,
 * through `findPurchase`, so the three cannot reach different conclusions.
 *
 * THE CLIENT IS LAZY. Building it at import time would throw during
 * `next build` on any machine without the key, which is every machine except
 * production. Nothing here runs until a request needs it.
 */

let client: Stripe | null = null;

export class ShopNotConfigured extends Error {
  constructor(what: string) {
    super(`Shop not configured: ${what} is not set`);
    this.name = "ShopNotConfigured";
  }
}

export function stripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new ShopNotConfigured("STRIPE_SECRET_KEY");
  client = new Stripe(key, {
    // Retries network failures and 409/5xx with backoff. A checkout that
    // fails because of one dropped packet is a lost sale.
    maxNetworkRetries: 2,
    timeout: 20_000,
    appInfo: { name: "tobiadonadon.com shop" },
  });
  return client;
}

/**
 * Where to send the buyer back to. Production always returns to the real
 * host, whatever Host header the request arrived with; everywhere else
 * (localhost, a preview deployment) returns to wherever the request came from,
 * so a test purchase on a preview lands on that preview.
 */
export function originFor(request: Request): string {
  if (process.env.VERCEL_ENV === "production") return SITE;
  return new URL(request.url).origin;
}

/** Checkout session ids look like cs_test_… or cs_live_…. Nothing else is sent to Stripe. */
const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{10,250}$/;

export type Purchase = {
  session: Stripe.Checkout.Session;
  product: Product;
  /** True once the money has actually arrived. */
  paid: boolean;
  email: string | null;
  name: string | null;
  paymentIntent: Stripe.PaymentIntent | null;
};

/**
 * THE PURCHASE BEHIND A SESSION ID, OR NOTHING.
 *
 * Returns null for anything that is not a real session for a product this
 * shop sells: a malformed id, an id Stripe does not know, a session made by
 * some other integration on the same account, or a test-mode id sent to a
 * live key. It never throws for any of those, because every caller wants the
 * same answer to all of them — "I cannot find that purchase" — and only a
 * missing key is a different kind of failure.
 */
export async function findPurchase(sessionId: unknown): Promise<Purchase | null> {
  if (typeof sessionId !== "string" || !SESSION_ID.test(sessionId)) return null;

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe().checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
  } catch (err) {
    if (err instanceof ShopNotConfigured) throw err;
    if (err instanceof Stripe.errors.StripeInvalidRequestError) return null;
    throw err;
  }

  return purchaseFromSession(session);
}

/** The same judgement, for a session that arrived in a webhook. */
export function purchaseFromSession(session: Stripe.Checkout.Session): Purchase | null {
  const product = productById(session.metadata?.product);
  if (!product) return null;

  const paid =
    session.status === "complete" &&
    (session.payment_status === "paid" ||
      session.payment_status === "no_payment_required");

  const pi = session.payment_intent;

  return {
    session,
    product,
    paid,
    email: session.customer_details?.email ?? null,
    name: session.customer_details?.name ?? null,
    paymentIntent: pi && typeof pi === "object" ? pi : null,
  };
}
