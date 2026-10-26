import Stripe from "stripe";
import { recordPurchase, syncSubscription } from "@/lib/membership/server";
import { welcomeMember } from "@/lib/membership/welcome";
import { deliver } from "@/lib/shop/deliver";
import { findPurchase, originFor, stripe } from "@/lib/shop/stripe";

/**
 * POST /api/stripe/webhook
 *
 * Stripe calls this when a checkout finishes. It is the path that delivers to
 * a buyer who paid and closed the tab before the redirect, so it has to be
 * right even when nobody is looking.
 *
 *   SIGNED OR REJECTED. The body is verified against STRIPE_WEBHOOK_SECRET
 *   before anything in it is believed. Anyone can POST to this URL.
 *
 *   THE SESSION IS RE-READ, NOT TRUSTED. The event says which session
 *   finished; the purchase itself is fetched fresh from Stripe, with its
 *   payment, the same way the download and the thank-you page fetch it.
 *
 *   500 MEANS "TRY AGAIN". Anything that should be retried (Stripe down, the
 *   email provider down, a missing key) answers 500, and Stripe retries with
 *   backoff for up to three days. Anything that will never succeed (an event
 *   for a product this shop does not sell) answers 200 so it stops.
 *
 *   MEMBERSHIPS ARE COPIED, NOT DELIVERED. A subscription event (or a
 *   subscription checkout finishing) re-reads that subscription from Stripe
 *   and copies its plan and status into `subscriptions` (lib/membership).
 *   Renewals, failed cards, plan changes and cancellations all arrive as
 *   customer.subscription.updated or .deleted.
 *
 *   A NEW MEMBER IS WELCOMED. A subscription checkout finishing also sends
 *   the welcome email (lib/membership/welcome.ts), once per subscription.
 *
 * Events to send (Stripe dashboard → Developers → Webhooks, or
 * scripts/membership-setup.mjs, which adds the subscription ones):
 *   checkout.session.completed
 *   checkout.session.async_payment_succeeded
 *   customer.subscription.created
 *   customer.subscription.updated
 *   customer.subscription.deleted
 *   customer.subscription.paused
 *   customer.subscription.resumed
 */

export const dynamic = "force-dynamic";

const DELIVER_ON = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

const SUBSCRIPTION_EVENTS = new Set<Stripe.Event.Type>([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
]);

/** Copy a subscription; a database or Stripe failure answers 500 so Stripe retries. */
async function membership(subscriptionId: string, eventId: string) {
  try {
    const result = await syncSubscription(subscriptionId);
    console.info("[membership] webhook sync", eventId, subscriptionId, result.status);
    return Response.json({ received: true, membership: result.status });
  } catch (err) {
    console.error("[membership] webhook sync failed, Stripe will retry", subscriptionId, err);
    return new Response("sync failed", { status: 500 });
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[shop] STRIPE_WEBHOOK_SECRET is not set; rejecting webhook so Stripe retries");
    return new Response("not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("missing signature", { status: 400 });

  // The raw body, exactly as sent. Parsing it first would change the bytes
  // and the signature would never match.
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe().webhooks.constructEventAsync(body, signature, secret);
  } catch (err) {
    console.warn("[shop] webhook signature rejected", err);
    return new Response("bad signature", { status: 400 });
  }

  if (SUBSCRIPTION_EVENTS.has(event.type)) {
    return membership((event.data.object as Stripe.Subscription).id, event.id);
  }

  if (!DELIVER_ON.has(event.type)) {
    return Response.json({ received: true, ignored: event.type });
  }

  const object = event.data.object as Stripe.Checkout.Session;
  if (object.mode === "subscription") {
    const sub = typeof object.subscription === "string" ? object.subscription : object.subscription?.id;
    if (!sub) return Response.json({ received: true, ignored: "no-subscription" });
    const synced = await membership(sub, event.id);
    if (!synced.ok) return synced;
    // A new member: the welcome email, once. A retry re-copies the
    // subscription (harmless) and skips a welcome that has already gone.
    try {
      const welcome = await welcomeMember(object.id, originFor(request));
      console.info("[membership] welcome", object.id, welcome.status);
      return Response.json({ received: true, welcome: welcome.status });
    } catch (err) {
      console.error("[membership] welcome email failed, Stripe will retry", object.id, err);
      return new Response("welcome failed", { status: 500 });
    }
  }

  const sessionId = object.id;

  try {
    const purchase = await findPurchase(sessionId);
    if (!purchase) {
      // Another integration's checkout on the same account, or a product
      // that no longer exists. Nothing to deliver, and retrying will not help.
      return Response.json({ received: true, delivered: false, reason: "not-ours" });
    }

    await recordPurchase(purchase);
    const result = await deliver(purchase, originFor(request));
    console.info("[shop] webhook delivery", sessionId, result.status);
    return Response.json({ received: true, delivery: result.status });
  } catch (err) {
    console.error("[shop] webhook delivery failed, Stripe will retry", sessionId, err);
    return new Response("delivery failed", { status: 500 });
  }
}
