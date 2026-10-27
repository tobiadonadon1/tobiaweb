import { emailTransport } from "@/lib/shop/deliver";
import { productFile, storedLink } from "@/lib/shop/file";
import { forSale, PRODUCTS } from "@/lib/shop/products";

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
 *
 * A paid product built ahead of its Stripe product (not `forSale` yet) is
 * listed as `pending` and does not count against `ok`: it cannot be bought,
 * so its missing file cannot fail a sale. The moment it gets its Stripe id it
 * counts like every other product, so a forgotten seal shows up here.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  const mode = key.startsWith("sk_live_") || key.startsWith("rk_live_")
    ? "live"
    : key.startsWith("sk_test_") || key.startsWith("rk_test_")
      ? "test"
      : null;

  const files: Record<string, { ok: boolean; bytes?: number; error?: string; pending?: true }> = {};
  for (const product of Object.values(PRODUCTS)) {
    const pending = !product.free && !forSale(product);
    try {
      // A stored file: its signed link has to open, and says how big it is.
      const bytes = product.file.stored
        ? Number((await fetch(await storedLink(product), { method: "HEAD" })).headers.get("content-length") ?? 0)
        : (await productFile(product)).length;
      if (!bytes) throw new Error("the stored file is missing or empty");
      files[product.id] = { ok: true, bytes, ...(pending ? { pending } : {}) };
    } catch (err) {
      files[product.id] = {
        ok: false,
        error: err instanceof Error ? err.message.replace(/\s+/g, " ").slice(0, 120) : "unreadable",
        ...(pending ? { pending } : {}),
      };
    }
  }

  const checks = {
    stripe: mode !== null,
    stripeMode: mode,
    webhookSecret: (process.env.STRIPE_WEBHOOK_SECRET ?? "").startsWith("whsec_"),
    email: emailTransport() !== null,
    emailVia: emailTransport(),
    // When Gmail hits its daily cap, mail goes out through Resend: is that set
    // up, and is its sender on a domain Resend can send from (not a Gmail
    // address)? Yes/no only, the address itself is never printed.
    emailFallback: emailTransport() === "gmail" && Boolean(process.env.RESEND_API_KEY),
    fallbackSender: Boolean(process.env.RESEND_EMAIL_FROM) && !/@gmail\.com>?\s*$/i.test(process.env.RESEND_EMAIL_FROM ?? ""),
    files,
  };

  const ok =
    checks.stripe &&
    checks.webhookSecret &&
    checks.email &&
    Object.values(files).every((f) => f.ok || f.pending);

  return Response.json(
    { ok, ...checks },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
