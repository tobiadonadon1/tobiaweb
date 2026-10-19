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
 *   products   construct-pro, construct-ultimate (metadata tier)
 *   prices     $19/month and $59/month, lookup keys construct_pro_monthly and
 *              construct_ultimate_monthly (lib/membership/tiers.ts). A changed
 *              amount makes a new price and moves the lookup key to it, so
 *              existing members keep what they pay until moved in Stripe.
 *   portal     a billing portal configuration (metadata construct=membership):
 *              switch Pro ⇄ Ultimate with proration, cancel at period end,
 *              update card and email, invoice history.
 *
 * Universal is priced on a call: in Stripe, add a price to any product with
 * metadata tier=universal and subscribe the member's customer to it, with
 * metadata member=<their member id>. The webhook does the rest.
 */
import Stripe from "stripe";

process.loadEnvFile(".env.local");
const live = process.argv.includes("--live");
const key = live ? process.env.STRIPE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
if (!key) throw new Error(`${live ? "STRIPE_SECRET_KEY" : "STRIPE_TEST_SECRET_KEY"} is not set`);
if (live !== /^(sk|rk)_live_/.test(key)) throw new Error("the key's mode doesn't match --live");
const stripe = new Stripe(key);
const webhookAt = process.argv.includes("--webhook") ? process.argv[process.argv.indexOf("--webhook") + 1] : null;

const PLANS = [
  { tier: "pro", product: "construct-pro", name: "Construct Pro", amount: 1900, lookup: "construct_pro_monthly",
    description: "Every premium skill, part of the training, the bi-monthly Q&A and Telegram DMs." },
  { tier: "ultimate", product: "construct-ultimate", name: "Construct Ultimate", amount: 5900, lookup: "construct_ultimate_monthly",
    description: "Everything in Pro, all the training, workshops, 1-on-1 calls, the network and a say in what's built." },
];

const prices = {};
for (const plan of PLANS) {
  let product;
  try {
    product = await stripe.products.retrieve(plan.product);
  } catch {
    product = await stripe.products.create({ id: plan.product, name: plan.name, description: plan.description, metadata: { tier: plan.tier } });
    console.log("product created", product.id);
  }
  const found = (await stripe.prices.list({ lookup_keys: [plan.lookup], limit: 1 })).data[0];
  if (found && found.active && found.unit_amount === plan.amount && found.recurring?.interval === "month") {
    prices[plan.tier] = found.id;
    console.log("price ok", plan.lookup, found.id);
    continue;
  }
  const price = await stripe.prices.create({
    product: product.id,
    currency: "usd",
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
