/**
 * Module resolution for the tests, so they can import the app's own
 * TypeScript the way Next does:
 *
 *   "@/lib/x"        → <root>/lib/x.ts (the tsconfig path alias)
 *   "./x" (no ext)   → ./x.ts or ./x.tsx, as the bundler would
 *   "stripe"         → tests/support/stripe-mock.mjs, so the shop can be
 *                      exercised end to end without a network or a key.
 *                      The mock itself still gets the real package, and
 *                      uses its genuine webhook signing.
 *   "nodemailer"     → tests/support/nodemailer-mock.mjs, which records mail
 *                      instead of sending it.
 */
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const mock = pathToFileURL(path.join(root, "tests/support/stripe-mock.mjs")).href;
const mailMock = pathToFileURL(path.join(root, "tests/support/nodemailer-mock.mjs")).href;
const EXTS = [".ts", ".tsx", ".js", ".mjs"];

function withExtension(file) {
  if (existsSync(file) && !file.endsWith("/")) {
    for (const ext of EXTS) if (file.endsWith(ext)) return file;
  }
  for (const ext of EXTS) if (existsSync(file + ext)) return file + ext;
  for (const ext of EXTS) if (existsSync(path.join(file, "index" + ext))) return path.join(file, "index" + ext);
  return null;
}

export function resolve(specifier, context, next) {
  if (specifier === "stripe" && context.parentURL !== mock) {
    return { url: mock, shortCircuit: true };
  }
  if (specifier === "nodemailer") {
    return { url: mailMock, shortCircuit: true };
  }
  // Next's bundler resolves "next/server" by itself; plain Node needs the file.
  if (specifier === "next/server") {
    return next("next/server.js", context);
  }
  if (specifier.startsWith("@/")) {
    const file = withExtension(path.join(root, specifier.slice(2)));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    const base = path.dirname(fileURLToPath(context.parentURL));
    const file = withExtension(path.resolve(base, specifier));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  return next(specifier, context);
}
