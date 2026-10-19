import Stripe from "stripe";
import { accountsConfigured, adminClient, type Member } from "@/lib/account";
import { stripe } from "@/lib/shop/stripe";
import type { Purchase } from "@/lib/shop/stripe";
import { higher, isTier, PLANS, type PaidTier, type Tier } from "./tiers";

/**
 * MEMBERSHIP, ON THE SERVER.
 *
 * Stripe is the truth about who pays; `subscriptions` is a fast copy of it,
 * so a page can ask "what tier is this member?" without a call to Stripe.
 * The copy is only ever written from a subscription freshly fetched from
 * Stripe (`syncSubscription`): by the webhook, and once more when the buyer
 * lands back on the site, so the new tier is there before they look.
 *
 * TEST AND LIVE SHARE ONE DATABASE. Every row says which Stripe mode wrote it
 * and only rows of the server's own mode count, so a test subscription made
 * on a laptop never unlocks anything on the real site.
 *
 * Never throws to a page: anything wrong reads as "free", and is logged.
 */

/** Statuses that keep the doors open. past_due: Stripe is still retrying the card. */
const ACCESS = ["active", "trialing", "past_due"];

export const liveMode = () => /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "");
const customerColumn = () => (liveMode() ? "stripe_customer_id" : "stripe_test_customer_id");

export type Membership = {
  tier: Tier;
  /** The subscription behind the tier, for the account page. */
  subscription: {
    id: string;
    tier: PaidTier;
    status: string;
    renews: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
};

const FREE: Membership = { tier: "free", subscription: null };

export async function membershipOf(member: Member | null): Promise<Membership> {
  if (!member || !accountsConfigured()) return FREE;
  try {
    const { data, error } = await adminClient()
      .from("subscriptions")
      .select("id, tier, status, current_period_end, cancel_at_period_end")
      .eq("member_id", member.id)
      .eq("livemode", liveMode())
      .in("status", ACCESS);
    if (error) throw error;
    let best: Membership = FREE;
    for (const row of data ?? []) {
      if (!isTier(row.tier) || row.tier === "free") continue;
      if (best.subscription && higher(best.tier, row.tier) === best.tier) continue;
      best = {
        tier: row.tier,
        subscription: {
          id: row.id,
          tier: row.tier,
          status: row.status,
          renews: row.current_period_end,
          cancelAtPeriodEnd: row.cancel_at_period_end,
        },
      };
    }
    return best;
  } catch (err) {
    console.error("[membership] could not read the tier", err);
    return FREE;
  }
}

/**
 * THE MEMBER'S STRIPE CUSTOMER, MADE ON FIRST NEED.
 *
 * One per member per mode, kept on `members`. Two tabs pressing Join at once
 * both reach Stripe with the same idempotency key and get the same customer.
 */
export async function customerFor(member: Member): Promise<string> {
  const db = adminClient();
  const column = customerColumn();
  const { data } = await db.from("members").select(column).eq("id", member.id).maybeSingle();
  const existing = (data as Record<string, string | null> | null)?.[column];
  if (existing) return existing;

  const customer = await stripe().customers.create(
    { email: member.email, metadata: { member: member.id } },
    { idempotencyKey: `construct-member-${member.id}-${liveMode() ? "live" : "test"}` },
  );
  await db.from("members").update({ [column]: customer.id }).eq("id", member.id).is(column, null);
  return customer.id;
}

/** An existing customer only: for the billing portal, which has nothing to show a new one. */
export async function existingCustomer(member: Member): Promise<string | null> {
  const column = customerColumn();
  const { data } = await adminClient().from("members").select(column).eq("id", member.id).maybeSingle();
  return (data as Record<string, string | null> | null)?.[column] ?? null;
}

const LOOKUP_TIER = Object.fromEntries(Object.values(PLANS).map((p) => [p.lookupKey, p.tier])) as Record<string, PaidTier>;

/** The tier a Stripe price sells: its metadata.tier, or its lookup key. Null: not a membership. */
export function tierOfPrice(price: Stripe.Price | null | undefined): PaidTier | null {
  if (!price) return null;
  const meta = price.metadata?.tier;
  if (meta === "pro" || meta === "ultimate" || meta === "universal") return meta;
  return (price.lookup_key && LOOKUP_TIER[price.lookup_key]) || null;
}

const prices = new Map<string, string>();

/** The live price id behind a plan, by lookup key (cached per server). */
export async function priceFor(tier: PaidTier): Promise<string | null> {
  const key = PLANS[tier].lookupKey;
  const cached = prices.get(key);
  if (cached) return cached;
  const list = await stripe().prices.list({ lookup_keys: [key], active: true, limit: 1 });
  const id = list.data[0]?.id ?? null;
  if (id) prices.set(key, id);
  return id;
}

export type Sync = { status: "synced"; tier: PaidTier; member: string } | { status: "not-ours" | "no-member" };

/**
 * COPY ONE SUBSCRIPTION FROM STRIPE INTO `subscriptions`.
 *
 * Always re-reads it from Stripe by id, so an old or replayed event can't
 * write a stale state over a newer one. The member comes from the
 * subscription's own metadata (set at checkout), or from the customer.
 */
export async function syncSubscription(id: string): Promise<Sync> {
  const sub = await stripe().subscriptions.retrieve(id, { expand: ["items.data.price"] });
  const item = sub.items.data[0];
  const tier = tierOfPrice(item?.price);
  if (!tier) return { status: "not-ours" };

  const db = adminClient();
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  let member = sub.metadata?.member || null;
  if (member) {
    // An account deleted since: nothing to copy, and retrying won't help.
    const { data } = await db.from("members").select("id").eq("id", member).maybeSingle();
    member = data?.id ?? null;
  }
  if (!member) {
    const column = sub.livemode ? "stripe_customer_id" : "stripe_test_customer_id";
    const { data } = await db.from("members").select("id").eq(column, customer).maybeSingle();
    member = data?.id ?? null;
  }
  if (!member) {
    console.warn("[membership] subscription with no member", sub.id, customer);
    return { status: "no-member" };
  }

  const periodEnd = item?.current_period_end;
  const { error } = await db.from("subscriptions").upsert({
    id: sub.id,
    member_id: member,
    customer_id: customer,
    tier,
    status: sub.status,
    price_id: item?.price?.id ?? null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancel_at_period_end: Boolean(sub.cancel_at_period_end || sub.cancel_at),
    livemode: sub.livemode,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`[membership] could not save ${sub.id}: ${error.message}`);
  return { status: "synced", tier, member };
}

/** A paid one-time purchase, indexed for the member's library. Never blocks delivery. */
export async function recordPurchase(purchase: Purchase) {
  if (!accountsConfigured() || !purchase.paid) return;
  try {
    const s = purchase.session;
    await adminClient().from("purchases").upsert(
      {
        session_id: s.id,
        member_id: s.metadata?.member || null,
        email: purchase.email?.toLowerCase() ?? null,
        product: purchase.product.id,
        amount: s.amount_total ?? 0,
        currency: s.currency ?? purchase.product.currency,
        livemode: s.livemode,
      },
      { onConflict: "session_id", ignoreDuplicates: true },
    );
  } catch (err) {
    console.error("[membership] could not record the purchase", err);
  }
}

/**
 * Every product this member bought: on their account, or before it with the
 * same address. Two plain queries rather than one `or` filter, so an address
 * with a comma in it can't bend the filter.
 */
export async function ownedProducts(member: Member): Promise<string[]> {
  if (!accountsConfigured()) return [];
  try {
    const db = adminClient();
    const base = () => db.from("purchases").select("product").eq("livemode", liveMode());
    const [mine, byEmail] = await Promise.all([
      base().eq("member_id", member.id),
      base().eq("email", member.email.toLowerCase()),
    ]);
    return [...new Set([...(mine.data ?? []), ...(byEmail.data ?? [])].map((r) => r.product as string))];
  } catch (err) {
    console.error("[membership] could not read purchases", err);
    return [];
  }
}

export const owns = async (member: Member, product: string) => (await ownedProducts(member)).includes(product);

let portalConfig: string | null | undefined;

/**
 * THE BILLING PORTAL, SET UP FOR MEMBERSHIPS: switch between Pro and Ultimate,
 * cancel at period end, card, invoices. scripts/membership-setup.mjs makes it
 * (metadata construct=membership); without it, Stripe's default is used.
 *
 * With `change`, the portal opens straight on "confirm your new plan" for
 * that subscription and price (one click to switch), and comes back to
 * `change.done` once it's confirmed.
 */
export async function portalSession(
  customer: string,
  returnUrl: string,
  change?: { subscription: string; price: string; done: string },
) {
  if (portalConfig === undefined) {
    const list = await stripe().billingPortal.configurations.list({ active: true, limit: 100 });
    portalConfig = list.data.find((c) => c.metadata?.construct === "membership")?.id ?? null;
  }
  let flow: Stripe.BillingPortal.SessionCreateParams.FlowData | undefined;
  if (change) {
    const sub = await stripe().subscriptions.retrieve(change.subscription);
    const item = sub.items.data[0];
    if (item && item.price.id !== change.price) {
      flow = {
        type: "subscription_update_confirm",
        subscription_update_confirm: { subscription: sub.id, items: [{ id: item.id, price: change.price, quantity: 1 }] },
        after_completion: { type: "redirect", redirect: { return_url: change.done } },
      };
    }
  }
  return stripe().billingPortal.sessions.create({
    customer,
    return_url: returnUrl,
    ...(portalConfig ? { configuration: portalConfig } : {}),
    ...(flow ? { flow_data: flow } : {}),
  });
}
