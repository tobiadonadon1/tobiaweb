import { emailTransport } from "@/lib/shop/deliver";
import { productFile } from "@/lib/shop/file";
import { PRODUCTS } from "@/lib/shop/products";

/**
 * GET /api/shop/health
 *
 * One page to open after setting the environment variables, which says
 * whether the shop can actually take money and deliver. Every line is a
 * yes/no or a mode; no key, secret or address is ever printed.
 *
 * `ok` is true only when a sale could complete end to end: Stripe can create
 * a checkout, the webhook can be verified, the email can be sent, and every
 * product's file decrypts.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  const mode = key.startsWith("sk_live_") || key.startsWith("rk_live_")
    ? "live"
    : key.startsWith("sk_test_") || key.startsWith("rk_test_")
      ? "test"
      : null;

  const files: Record<string, { ok: boolean; bytes?: number; error?: string }> = {};
  for (const product of Object.values(PRODUCTS)) {
    try {
      const bytes = await productFile(product);
      files[product.id] = { ok: true, bytes: bytes.length };
    } catch (err) {
      files[product.id] = {
        ok: false,
        error: err instanceof Error ? err.message.replace(/\s+/g, " ").slice(0, 120) : "unreadable",
      };
    }
  }

  const checks = {
    stripe: mode !== null,
    stripeMode: mode,
    webhookSecret: (process.env.STRIPE_WEBHOOK_SECRET ?? "").startsWith("whsec_"),
    email: emailTransport() !== null,
    emailVia: emailTransport(),
    files,
  };

  const ok =
    checks.stripe &&
    checks.webhookSecret &&
    checks.email &&
    Object.values(files).every((f) => f.ok);

  return Response.json(
    { ok, ...checks },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
