import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseKey, unseal } from "@/lib/shop/seal";
import { ShopNotConfigured } from "@/lib/shop/stripe";

/**
 * A DESIGN BLOCK'S SOURCE, OR THE WHOLE LIBRARY, DECRYPTED.
 *
 * The readable source is what members get, and the repository is public, so
 * it is sealed with SHOP_FILE_KEY like the shop's products
 * (scripts/design-build.mjs writes private/design/). next.config.ts lists the
 * folder for the route that reads it. Cached per instance: a deployment's
 * files never change.
 */
const cache = new Map<string, Promise<Buffer>>();

export function designFile(name: string): Promise<Buffer> {
  // Names come from the manifest, never from the request, but keep it a plain file name anyway.
  if (!/^[a-z0-9-]+\.(tsx|zip)$/.test(name)) return Promise.reject(new Error(`bad design file name: ${name}`));
  const hit = cache.get(name);
  if (hit) return hit;
  const load = (async () => {
    const raw = process.env.SHOP_FILE_KEY;
    if (!raw) throw new ShopNotConfigured("SHOP_FILE_KEY");
    const sealed = await readFile(path.join(process.cwd(), "private", "design", `${name}.enc`));
    return unseal(sealed, parseKey(raw));
  })();
  cache.set(name, load);
  load.catch(() => cache.delete(name));
  return load;
}
