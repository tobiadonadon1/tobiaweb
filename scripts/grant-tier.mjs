/**
 * GIVE SOMEONE A PLAN BY HAND: no Stripe, no invoice.
 *
 *   node scripts/grant-tier.mjs <email> <pro|ultimate|universal|none>
 *
 * Sets members.granted_tier for the Construct account with that address
 * (they must have signed up first). The site reads the higher of the grant
 * and any subscription (lib/membership/server.ts), so it shows on their next
 * page load. "none" takes the grant back; a subscription they pay for stays.
 *
 * Reads ACCOUNTS_SUPABASE_URL and ACCOUNTS_SUPABASE_SECRET_KEY from
 * .env.local. Needs the migration 20261022120000_grants_and_shelves.sql.
 */
process.loadEnvFile(".env.local");

const [email, tier] = process.argv.slice(2);
const TIERS = ["pro", "ultimate", "universal", "none"];
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !TIERS.includes(tier)) {
  console.error("usage: node scripts/grant-tier.mjs <email> <pro|ultimate|universal|none>");
  process.exit(1);
}

const url = process.env.ACCOUNTS_SUPABASE_URL;
const key = process.env.ACCOUNTS_SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("ACCOUNTS_SUPABASE_URL / ACCOUNTS_SUPABASE_SECRET_KEY are not in .env.local");
  process.exit(1);
}

const address = email.trim().toLowerCase();
const res = await fetch(`${url}/rest/v1/members?email=eq.${encodeURIComponent(address)}`, {
  method: "PATCH",
  headers: {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
    prefer: "return=representation",
  },
  body: JSON.stringify({ granted_tier: tier === "none" ? null : tier }),
});
const body = await res.json().catch(() => null);
if (!res.ok) {
  console.error(`failed (${res.status}):`, body?.message ?? body);
  if (/granted_tier/.test(body?.message ?? "")) console.error("Apply supabase/migrations/20261022120000_grants_and_shelves.sql first.");
  process.exit(1);
}
if (!Array.isArray(body) || body.length === 0) {
  console.error(`No Construct account for ${address}. Sign up on the site first, then run this again.`);
  process.exit(1);
}
console.log(tier === "none" ? `${address}: grant removed` : `${address}: now ${tier}`);
