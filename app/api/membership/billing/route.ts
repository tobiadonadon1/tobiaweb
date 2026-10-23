import { currentMember } from "@/lib/account";
import { ACCOUNT_HREF, JOIN_HREF } from "@/components/account/links";
import { existingCustomer, membershipOf, portalSession } from "@/lib/membership/server";
import { originFor } from "@/lib/shop/stripe";

/**
 * POST /api/membership/billing
 *
 * "Manage billing": Stripe's own portal, where a member changes plan, card or
 * address, downloads invoices, or cancels (at the end of the period they
 * paid for). Nothing about billing is rebuilt on this site.
 *
 * With to=free (the Free card under "Change plan"), it opens straight on
 * Stripe's "cancel your plan" step: the plan stays open to the end of the
 * period, then the account is on Free.
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = originFor(request);
  const { member } = await currentMember(request);
  if (!member) return Response.redirect(`${origin}${ACCOUNT_HREF}?next=${encodeURIComponent(ACCOUNT_HREF)}`, 303);

  try {
    const customer = await existingCustomer(member);
    if (!customer) return Response.redirect(`${origin}${JOIN_HREF}`, 303);
    const form = await request.formData().catch(() => null);
    const sub = form?.get("to") === "free" ? (await membershipOf(member)).subscription : null;
    const back = `${origin}${ACCOUNT_HREF}`;
    const cancel = sub && !sub.cancelAtPeriodEnd ? { subscription: sub.id, done: `${back}#billing` } : undefined;
    const portal = await portalSession(customer, back, cancel).catch((err) => {
      if (!cancel) throw err;
      console.warn("[membership] cancel flow failed, opening the portal", err);
      return portalSession(customer, back);
    });
    return Response.redirect(portal.url, 303);
  } catch (err) {
    console.error("[membership] billing portal failed", err);
    return Response.redirect(`${origin}${ACCOUNT_HREF}?billing=error`, 303);
  }
}
