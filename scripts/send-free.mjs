/**
 * SEND A FREE PRODUCT BY HAND.
 *
 *   node scripts/send-free.mjs <product-id> <email>
 *
 * The same email the site sends when someone claims a free product, for when
 * the site's send failed. Gmail first, Resend if Gmail refuses (deliver.ts).
 * Reads SHOP_FILE_KEY, GMAIL_APP_PASSWORD and RESEND_API_KEY from .env.local.
 */
import { registerHooks } from "node:module";
import { resolve } from "../tests/support/hooks.mjs";

// The tests' resolver for "@/" and extensionless TypeScript imports, minus its
// mocks: this sends real mail.
registerHooks({
  resolve: (specifier, context, next) =>
    specifier === "stripe" || specifier === "nodemailer" ? next(specifier, context) : resolve(specifier, context, next),
});

process.loadEnvFile(".env.local");

const [id, to] = process.argv.slice(2);
const { productById } = await import("../lib/shop/products.ts");
const { sendFree } = await import("../lib/shop/deliver.ts");
const { SITE } = await import("../lib/site.ts");

const product = productById(id);
if (!product || product.priceCents !== 0 || !to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
  console.error("usage: scripts/send-free.mjs <free-product-id> <email>");
  process.exit(1);
}
const { id: messageId } = await sendFree(product, to.trim(), SITE);
console.log(`sent ${product.name} to ${to} (${messageId})`);
