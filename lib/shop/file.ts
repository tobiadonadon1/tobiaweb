import { readFile } from "node:fs/promises";
import path from "node:path";
import { adminClient } from "../account";
import type { Product } from "./products";
import { parseKey, unseal } from "./seal";
import { ShopNotConfigured } from "./stripe";

/**
 * THE PRODUCT'S BYTES, DECRYPTED.
 *
 * The sealed file is read from the deployment's own filesystem. It reaches the
 * serverless bundle because next.config.ts lists `private/**` in
 * `outputFileTracingIncludes` for the routes that read it; a path built at
 * runtime is invisible to the tracer otherwise, and the route would find
 * nothing in production while working perfectly on a laptop.
 *
 * Cached per instance. The file is a few hundred kilobytes and never changes
 * between deployments, so decrypting it once per cold start is enough.
 */

const cache = new Map<string, Promise<Buffer>>();

export function productFile(product: Product): Promise<Buffer> {
  const hit = cache.get(product.id);
  if (hit) return hit;

  const load = (async () => {
    const raw = process.env.SHOP_FILE_KEY;
    if (!raw) throw new ShopNotConfigured("SHOP_FILE_KEY");
    if (!product.file.sealed) throw new Error(`${product.id} is stored, not sealed: use storedLink`);
    // "private" is written out, not taken from the product, so the tracer can
    // see which one folder this reads from instead of tracing the project.
    const sealed = await readFile(path.join(process.cwd(), "private", product.file.sealed));
    return unseal(sealed, parseKey(raw));
  })();

  cache.set(product.id, load);
  // A failure is not cached: the next request tries again rather than being
  // stuck with one bad read for the life of the instance.
  load.catch(() => cache.delete(product.id));
  return load;
}

/**
 * A STORED PRODUCT'S LINK: a file too big to send through a function (see
 * `file.stored` in products.ts) is handed out as a link to the private
 * "products" bucket, signed for five minutes and saved under the product's
 * filename. Only ever made after the same checks a sealed file gets.
 */
export async function storedLink(product: Product): Promise<string> {
  if (!product.file.stored) throw new Error(`${product.id} has no stored file`);
  const { data, error } = await adminClient()
    .storage.from("products")
    .createSignedUrl(product.file.stored, 300, { download: product.file.filename });
  if (error || !data?.signedUrl) throw error ?? new Error(`no signed link for ${product.id}`);
  return data.signedUrl;
}
