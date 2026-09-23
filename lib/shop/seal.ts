import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * A SEALED FILE.
 *
 * The repository is public, so anything committed to it is published. The
 * products still ship inside the repository, because that is the only place a
 * deployment is guaranteed to find them: no bucket to provision, no second
 * service that can be down while the checkout is up. What is committed is the
 * file encrypted with AES-256-GCM, and the key lives only in the deployment's
 * environment (SHOP_FILE_KEY). Without the key the committed bytes are noise;
 * with it, GCM's tag also proves the file was not altered on the way.
 *
 * Layout: "SEAL" · version byte · 12-byte IV · 16-byte tag · ciphertext.
 *
 * Pure functions, no filesystem, so the sealing script and the download route
 * share exactly one implementation.
 */

const MAGIC = Buffer.from("SEAL", "ascii");
const VERSION = 1;
const IV_BYTES = 12;
const TAG_BYTES = 16;
const HEADER = MAGIC.length + 1 + IV_BYTES + TAG_BYTES;

export function parseKey(base64: string | undefined): Buffer {
  const key = Buffer.from((base64 ?? "").trim(), "base64");
  if (key.length !== 32) {
    throw new Error("SHOP_FILE_KEY must be 32 bytes, base64 encoded");
  }
  return key;
}

export function newKey(): string {
  return randomBytes(32).toString("base64");
}

export function seal(plain: Buffer, key: Buffer): Buffer {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([MAGIC, Buffer.from([VERSION]), iv, cipher.getAuthTag(), body]);
}

export function unseal(sealed: Buffer, key: Buffer): Buffer {
  if (
    sealed.length < HEADER ||
    !sealed.subarray(0, MAGIC.length).equals(MAGIC) ||
    sealed[MAGIC.length] !== VERSION
  ) {
    throw new Error("Not a sealed file");
  }
  let at = MAGIC.length + 1;
  const iv = sealed.subarray(at, (at += IV_BYTES));
  const tag = sealed.subarray(at, (at += TAG_BYTES));
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  // Throws if the key is wrong or a single byte was changed.
  return Buffer.concat([decipher.update(sealed.subarray(at)), decipher.final()]);
}
