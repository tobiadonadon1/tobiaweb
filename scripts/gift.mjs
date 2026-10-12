/**
 * SEND A PAID PRODUCT AS A GIFT.
 *
 *   node --import ./tests/support/register.mjs scripts/gift.mjs <product-id> <email>
 *
 * Sends the same email a buyer gets, from the shop's Gmail, with a download
 * link signed for that one address (lib/shop/free.ts, giftLink). Reads
 * SHOP_FILE_KEY and GMAIL_APP_PASSWORD from .env.local. The link points at
 * the public site, so the deployed site must have the gift route.
 */
process.loadEnvFile(".env.local");

const [id, to] = process.argv.slice(2);
const { productById } = await import("../lib/shop/products.ts");
const { sendGift } = await import("../lib/shop/deliver.ts");
const { SITE } = await import("../lib/site.ts");

const product = productById(id);
if (!product || !to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
  console.error("usage: scripts/gift.mjs <product-id> <email>");
  process.exit(1);
}
const { id: messageId, via } = await sendGift(product, to.trim(), SITE);
console.log(`sent ${product.name} to ${to} via ${via} (${messageId})`);
