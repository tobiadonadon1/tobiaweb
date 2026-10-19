#!/usr/bin/env node
/**
 * MEMBERSHIPS IN STRIPE, SET UP ONCE (and safe to run again).
 *
 *   node scripts/membership-setup.mjs            test mode (STRIPE_TEST_SECRET_KEY)
 *   node scripts/membership-setup.mjs --live     live mode (STRIPE_SECRET_KEY)
 *   add --webhook https://… to also subscribe that webhook endpoint to the
 *   subscription events (it must already exist in this mode)
 *
 * Makes, or finds and leaves alone:
 *   products   live: Tobia's own "Pro Membership" and "Ultimate Membership"
 *              (prod_VTIbTqejpEbcta, prod_VTIczo47yeQ0Uz); test:
 *              construct-pro and construct-ultimate. Each gets metadata tier.
 *   prices     €19 and €59 a month, lookup keys construct_pro_monthly and
 *              construct_ultimate_monthly (lib/membership/tiers.ts). The
 *              product's own default price is used when it already matches;
 *              a changed amount makes a new price and moves the lookup key to
 *              it, so existing members keep what they pay until moved in Stripe.
 *              Universal is priced per person: Tobia makes its price by hand,
 *              with metadata tier=universal.
 *   portal     a billing portal configuration (metadata construct=membership):
 *              switch between the plans with proration, cancel at period end,
 *              update card and email, invoice history.
 */
import Stripe from "stripe";

process.loadEnvFile(".env.local");
const live = process.argv.includes("--live");
const key = live ? process.env.STRIPE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
if (!key) throw new Error(`${live ? "STRIPE_SECRET_KEY" : "STRIPE_TEST_SECRET_KEY"} is not set`);
if (live !== /^(sk|rk)_live_/.test(key)) throw new Error("the key's mode doesn't match --live");
const stripe = new Stripe(key);
const webhookAt = process.argv.includes("--webhook") ? process.argv[process.argv.indexOf("--webhook") + 1] : null;

const CURRENCY = "eur";
const PLANS = [
  { tier: "pro", product: live ? "prod_VTIbTqejpEbcta" : "construct-pro", name: "Pro Membership", amount: 1900,
    lookup: "construct_pro_monthly", description: "Every premium skill, the Q&A, and a direct line to me." },
  { tier: "ultimate", product: live ? "prod_VTIczo47yeQ0Uz" : "construct-ultimate", name: "Ultimate Membership", amount: 5900,
    lookup: "construct_ultimate_monthly", description: "Everything, plus the people, the calls and a say in what I build." },
];
const fits = (price, plan) =>
  price && price.active && price.unit_amount === plan.amount && price.currency === CURRENCY &&
  price.recurring?.interval === "month" && price.recurring?.interval_count === 1;

const prices = {};
for (const plan of PLANS) {
  let product;
  try {
    product = await stripe.products.retrieve(plan.product);
  } catch {
    if (live) throw new Error(`live product ${plan.product} not found`);
    product = await stripe.products.create({ id: plan.product, name: plan.name, description: plan.description, metadata: { tier: plan.tier } });
    console.log("product created", product.id);
  }
  if (product.metadata?.tier !== plan.tier) await stripe.products.update(product.id, { metadata: { tier: plan.tier } });
  const found = (await stripe.prices.list({ lookup_keys: [plan.lookup], limit: 1 })).data[0];
  if (fits(found, plan) && found.product === product.id) {
    prices[plan.tier] = found.id;
    console.log("price ok", plan.lookup, found.id);
    continue;
  }
  // The product's own price, made in the dashboard: give it the lookup key rather than make another.
  const own = product.default_price ? await stripe.prices.retrieve(product.default_price) : null;
  if (fits(own, plan)) {
    await stripe.prices.update(own.id, { lookup_key: plan.lookup, transfer_lookup_key: true, metadata: { tier: plan.tier } });
    prices[plan.tier] = own.id;
    console.log("price adopted", plan.lookup, own.id);
    continue;
  }
  const price = await stripe.prices.create({
    product: product.id,
    currency: CURRENCY,
    unit_amount: plan.amount,
    recurring: { interval: "month" },
    lookup_key: plan.lookup,
    transfer_lookup_key: true,
    metadata: { tier: plan.tier },
  });
  prices[plan.tier] = price.id;
  console.log("price created", plan.lookup, price.id);
}

const config = {
  business_profile: { headline: "Construct membership" },
  features: {
    customer_update: { enabled: true, allowed_updates: ["email", "address", "name"] },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    subscription_cancel: { enabled: true, mode: "at_period_end", cancellation_reason: { enabled: true, options: ["too_expensive", "missing_features", "unused", "other"] } },
    subscription_update: {
      enabled: true,
      default_allowed_updates: ["price"],
      proration_behavior: "create_prorations",
      products: PLANS.map((p) => ({ product: p.product, prices: [prices[p.tier]] })),
    },
  },
  metadata: { construct: "membership" },
};
const existing = (await stripe.billingPortal.configurations.list({ limit: 100 })).data.find((c) => c.metadata?.construct === "membership");
if (existing) {
  await stripe.billingPortal.configurations.update(existing.id, { ...config, active: true });
  console.log("portal updated", existing.id);
} else {
  console.log("portal created", (await stripe.billingPortal.configurations.create(config)).id);
}

if (webhookAt && !webhookAt.startsWith("--")) {
  const WANT = [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.paused",
    "customer.subscription.resumed",
  ];
  const endpoint = (await stripe.webhookEndpoints.list({ limit: 100 })).data.find((e) => e.url === webhookAt);
  if (!endpoint) throw new Error(`no webhook endpoint at ${webhookAt} in this mode`);
  if (endpoint.enabled_events.includes("*")) {
    console.log("webhook already receives every event");
  } else {
    const events = [...new Set([...endpoint.enabled_events, ...WANT])];
    await stripe.webhookEndpoints.update(endpoint.id, { enabled_events: events });
    console.log("webhook events", events.join(", "));
  }
}
console.log(`done (${live ? "live" : "test"} mode)`);
