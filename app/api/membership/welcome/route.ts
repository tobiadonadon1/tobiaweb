import { ACCOUNT_HREF, JOIN_HREF } from "@/components/account/links";
import { syncSubscription } from "@/lib/membership/server";
import { originFor, stripe } from "@/lib/shop/stripe";

/**
 * GET /api/membership/welcome?session_id=cs_…
 *
 * Where Stripe sends a new member back. The webhook will copy the
 * subscription too, but it can arrive a second after the person does; this
 * copies it first, so the account page they land on already shows the plan.
 * Both paths read the subscription fresh from Stripe, so they agree.
 */

export const dynamic = "force-dynamic";

const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{10,250}$/;

export async function GET(request: Request) {
  const origin = originFor(request);
  const id = new URL(request.url).searchParams.get("session_id") ?? "";
  if (!SESSION_ID.test(id)) return Response.redirect(`${origin}${JOIN_HREF}`, 303);

  try {
    const session = await stripe().checkout.sessions.retrieve(id);
    const sub = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (session.mode === "subscription" && session.status === "complete" && sub) {
      const r = await syncSubscription(sub);
      if (r.status === "synced") return Response.redirect(`${origin}${ACCOUNT_HREF}?joined=${r.tier}`, 303);
    }
  } catch (err) {
    console.error("[membership] welcome: could not sync, the webhook will", err);
  }
  return Response.redirect(`${origin}${ACCOUNT_HREF}?joined=1`, 303);
}
