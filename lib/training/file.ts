import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseKey, unseal } from "@/lib/shop/seal";
import { ShopNotConfigured } from "@/lib/shop/stripe";

/** A training sheet's PDF or its page picture, decrypted (see lib/training/sheets.ts). Cached per instance. */
const cache = new Map<string, Promise<Buffer>>();

export function sheetFile(id: string, kind: "pdf" | "webp" = "pdf"): Promise<Buffer> {
  if (!/^[a-z0-9-]+$/.test(id)) return Promise.reject(new Error(`bad sheet id: ${id}`));
  const name = `${id}.${kind}`;
  const hit = cache.get(name);
  if (hit) return hit;
  const load = (async () => {
    const raw = process.env.SHOP_FILE_KEY;
    if (!raw) throw new ShopNotConfigured("SHOP_FILE_KEY");
    const sealed = await readFile(path.join(process.cwd(), "private", "training", `${name}.enc`));
    return unseal(sealed, parseKey(raw));
  })();
  cache.set(name, load);
  load.catch(() => cache.delete(name));
  return load;
}
