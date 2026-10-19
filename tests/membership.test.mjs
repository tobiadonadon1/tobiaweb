/**
 * WHAT EACH PLAN OPENS AND WHAT EACH SKILL COSTS IT.
 *
 * lib/membership/tiers.ts is the one place the plans are written; the
 * checkout, the downloads, the requests board and the buy buttons all ask it.
 * These pin the promises the join page makes.
 *
 *   npm test
 */
import test from "node:test";
import assert from "node:assert/strict";

const { offer, hasPerk, trainingReach, atLeast, higher, isTier, PLANS, SELF_SERVE, money } = await import(
  "../lib/membership/tiers.ts"
);
const { PRODUCTS } = await import("../lib/shop/products.ts");

const premium = { free: false, priceCents: 500 };
const unique = { free: false, level: "unique", priceCents: 2000 };
const exclusive = { free: false, level: "exclusive", priceCents: 0 };

test("tiers: ranks, and nothing that isn't a tier passes for one", () => {
  assert.ok(atLeast("ultimate", "pro"));
  assert.ok(!atLeast("pro", "ultimate"));
  assert.equal(higher("pro", "universal"), "universal");
  for (const bad of ["", "admin", "toString", "__proto__", null, 3]) assert.equal(isTier(bad), false);
  assert.deepEqual(SELF_SERVE, ["pro", "ultimate"]);
});

test("free skills are free for everyone", () => {
  for (const tier of ["free", "pro", "ultimate", "universal"]) {
    assert.deepEqual(offer({ free: true, priceCents: 0 }, tier), { kind: "free" });
  }
});

test("premium skills: bought on Free, included from Pro up", () => {
  assert.deepEqual(offer(premium, "free"), { kind: "buy", priceCents: 500, fullCents: 500 });
  for (const tier of ["pro", "ultimate", "universal"]) assert.deepEqual(offer(premium, tier), { kind: "included" });
});

test("unique skills: everyone pays, Pro 15% less, Ultimate half, in whole units", () => {
  assert.equal(offer(unique, "free").priceCents, 2000);
  assert.equal(offer(unique, "pro").priceCents, 1700);
  assert.equal(offer(unique, "ultimate").priceCents, 1000);
  assert.equal(offer(unique, "universal").priceCents, 1000);
  // Never under one unit, and a set member price wins; 0 means included.
  assert.equal(offer({ ...unique, priceCents: 100 }, "ultimate").priceCents, 100);
  assert.equal(offer({ ...unique, memberPrice: { pro: 1500 } }, "pro").priceCents, 1500);
  assert.deepEqual(offer({ ...unique, memberPrice: { ultimate: 0 } }, "ultimate"), { kind: "included" });
});

test("exclusive skills: Ultimate and up only, never sold to anyone else", () => {
  assert.deepEqual(offer(exclusive, "free"), { kind: "locked", needs: "ultimate" });
  assert.deepEqual(offer(exclusive, "pro"), { kind: "locked", needs: "ultimate" });
  assert.deepEqual(offer(exclusive, "ultimate"), { kind: "included" });
});

test("perks: Free opens none of the paid ones, Ultimate opens everything Pro does", () => {
  for (const perk of ["premium-skills", "training", "qa", "telegram", "calls", "requests", "commission"]) {
    assert.equal(hasPerk("free", perk), false, perk);
  }
  for (const perk of ["premium-skills", "training", "qa", "telegram"]) assert.ok(hasPerk("pro", perk), perk);
  for (const perk of ["workshop", "calls", "network", "commission", "requests", "exclusive-skills"]) {
    assert.equal(hasPerk("pro", perk), false, perk);
    assert.ok(hasPerk("ultimate", perk), perk);
    assert.ok(hasPerk("universal", perk), perk);
  }
  assert.deepEqual(trainingReach("free"), []);
  assert.deepEqual(trainingReach("pro"), ["pro"]);
  assert.deepEqual(trainingReach("ultimate"), ["pro", "ultimate"]);
});

test("plans: the self-serve ones have a price and a Stripe lookup key, Universal has neither", () => {
  for (const t of SELF_SERVE) {
    assert.ok(PLANS[t].priceCents > 0, t);
    assert.match(PLANS[t].lookupKey, /^construct_[a-z]+_monthly$/);
  }
  assert.equal(PLANS.universal.priceCents, null);
  assert.equal(PLANS.universal.lookupKey, null);
  assert.equal(money(1900, "usd"), "$19");
  assert.equal(money(450, "eur"), "€4.50");
});

test("every paid skill on the shelf is included with Pro (none is marked unique or exclusive yet)", () => {
  const paid = Object.values(PRODUCTS).filter((p) => !p.free);
  assert.ok(paid.length > 0);
  for (const p of paid) assert.deepEqual(offer(p, "pro"), { kind: "included" }, p.id);
});
