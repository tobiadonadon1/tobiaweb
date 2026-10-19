import { currentMember } from "@/lib/account";
import { ACCOUNT_HREF, JOIN_HREF } from "@/components/account/links";
import { existingCustomer, portalSession } from "@/lib/membership/server";
import { originFor } from "@/lib/shop/stripe";

/**
 * POST /api/membership/billing
 *
 * "Manage billing": Stripe's own portal, where a member changes plan, card or
 * address, downloads invoices, or cancels (at the end of the period they
 * paid for). Nothing about billing is rebuilt on this site.
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = originFor(request);
  const { member } = await currentMember(request);
  if (!member) return Response.redirect(`${origin}${ACCOUNT_HREF}?next=${encodeURIComponent(ACCOUNT_HREF)}`, 303);

  try {
    const customer = await existingCustomer(member);
    if (!customer) return Response.redirect(`${origin}${JOIN_HREF}`, 303);
    const portal = await portalSession(customer, `${origin}${ACCOUNT_HREF}`);
    return Response.redirect(portal.url, 303);
  } catch (err) {
    console.error("[membership] billing portal failed", err);
    return Response.redirect(`${origin}${ACCOUNT_HREF}?billing=error`, 303);
  }
}
