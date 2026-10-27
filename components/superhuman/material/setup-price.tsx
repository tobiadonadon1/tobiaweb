"use client";

import { useMember } from "@/components/account/use-member";
import { money, offer, planName } from "@/lib/membership/tiers";
import { forSale, priceText, productById } from "@/lib/shop/products";

/**
 * A setup card's price, as the person reading it would pay it. A member whose
 * plan includes the setup was shown "€15" on the card and then "Download" on
 * its page; now the card says "Included in Pro" too. Says nothing until it
 * knows who is signed in, so a member never sees the full price flash first.
 */
export function SetupPrice({ productId, before = "" }: { productId: string; before?: string }) {
  const member = useMember();
  const product = productById(productId);
  if (!product || member === undefined) return null;

  let text = priceText(product);
  if (member && forSale(product)) {
    const deal = offer(product, member.tier);
    if (deal.kind === "included") text = `Included in ${planName(member.tier)}`;
    else if (deal.kind === "buy" && deal.priceCents < deal.fullCents) text = money(deal.priceCents, product.currency);
    else if (deal.kind === "locked") text = `${planName(deal.needs)} only`;
  }
  return <>{before + text}</>;
}
