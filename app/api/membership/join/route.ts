import { currentMember } from "@/lib/account";
import { ACCOUNT_HREF, JOIN_HREF } from "@/components/account/links";
import { customerFor, membershipOf, portalSession, priceFor } from "@/lib/membership/server";
import { PLANS, SELF_SERVE, type PaidTier } from "@/lib/membership/tiers";
import { originFor, stripe } from "@/lib/shop/stripe";

/**
 * POST /api/membership/join   (form: tier=pro|ultimate)
 *
 * The Join button. A plain form posting here, like the Buy button, and the
 * answer is always a 303 somewhere a person can read:
 *
 *   not signed in       → the account page, then back to the plans
 *   already a member    → Stripe's billing portal, where the plan is changed
 *                         (an upgrade is prorated there; no second subscription)
 *   otherwise           → Stripe Checkout for the plan, tied to the account
 *   anything wrong      → the plans, with ?join=error (or soon, before the
 *                         Stripe prices exist)
 *
 * The account comes first so the subscription can belong to it: the person
 * pays as the member they are, and the webhook knows whose tier to raise.
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = originFor(request);
  const form = await request.formData().catch(() => null);
  const asked = String(form?.get("tier") ?? "");
  const back = (flag?: string) =>
    Response.redirect(`${origin}${JOIN_HREF}${flag ? `?join=${flag}` : ""}${asked ? `#${asked}` : ""}`, 303);

  if (!SELF_SERVE.includes(asked as PaidTier)) return back();
  const tier = asked as PaidTier;

  const { member } = await currentMember(request);
  if (!member) {
    const next = `${JOIN_HREF}?tier=${tier}#${tier}`;
    return Response.redirect(`${origin}${ACCOUNT_HREF}?mode=signup&next=${encodeURIComponent(next)}`, 303);
  }

  try {
    const now = await membershipOf(member);
    const customer = await customerFor(member);

    if (now.subscription) {
      const portal = await portalSession(customer, `${origin}${ACCOUNT_HREF}`);
      return Response.redirect(portal.url, 303);
    }

    const price = await priceFor(tier);
    if (!price) return back("soon");

    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      customer,
      client_reference_id: member.id,
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      metadata: { member: member.id, tier },
      subscription_data: { metadata: { member: member.id, tier } },
      success_url: `${origin}/api/membership/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${JOIN_HREF}#${tier}`,
      custom_text: {
        submit: { message: `${PLANS[tier].name} starts now. Cancel any time from your account.` },
      },
    });
    if (!session.url) throw new Error("Stripe returned a session without a URL");
    return Response.redirect(session.url, 303);
  } catch (err) {
    console.error("[membership] join failed", err);
    return back("error");
  }
}
