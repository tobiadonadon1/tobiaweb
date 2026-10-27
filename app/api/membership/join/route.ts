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
 *   not signed in       → the account page with the plan chosen, which comes
 *                         back here once the account exists
 *   already a member    → Stripe's billing portal, opened on "confirm your
 *                         new plan" (prorated; no second subscription), then
 *                         back to the account with ?joined=<tier>
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
    // The account page asks for the email and password with this plan
    // chosen, then posts here again, signed in.
    return Response.redirect(`${origin}${ACCOUNT_HREF}?mode=signup&plan=${tier}`, 303);
  }

  try {
    const now = await membershipOf(member);
    const customer = await customerFor(member);

    const price = await priceFor(tier);

    if (now.subscription) {
      const change =
        price && now.subscription.tier !== tier
          ? { subscription: now.subscription.id, price, done: `${origin}${ACCOUNT_HREF}?joined=${tier}` }
          : undefined;
      const portal = await portalSession(customer, `${origin}${ACCOUNT_HREF}`, change).catch((err) => {
        // A subscription the flow can't change (one Tobia set up by hand): the plain portal.
        console.warn("[membership] plan change flow failed, opening the portal", err);
        return portalSession(customer, `${origin}${ACCOUNT_HREF}`);
      });
      return Response.redirect(portal.url, 303);
    }

    if (!price) return back("soon");

    // Where they came from (components/account/footprints.tsx), kept on the
    // subscription so a new member can be traced to the page that sold it.
    const cookie = request.headers.get("cookie") ?? "";
    const read = (name: string) => {
      const m = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
      try {
        return m ? decodeURIComponent(m[1]).slice(0, 300) : "";
      } catch {
        return "";
      }
    };
    const [landing = "", ref = ""] = read("cx_land").split("|");
    const source = Object.fromEntries(
      Object.entries({ from: read("cx_from"), landing, ref }).filter(([, v]) => v),
    );

    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      customer,
      client_reference_id: member.id,
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      metadata: { member: member.id, tier, ...source },
      subscription_data: { metadata: { member: member.id, tier, ...source } },
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
