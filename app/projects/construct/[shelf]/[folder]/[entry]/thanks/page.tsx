import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { BackLink } from "@/components/ui/back-link";
import { FOLDER_BY_ID } from "@/components/superhuman/material/material-data";
import { Specimen } from "@/components/superhuman/material/specimens";
import { Commands } from "@/components/superhuman/material/product/commands";
import { downloadHref, PRODUCTS, SHOP_EMAIL as EMAIL, type Product } from "@/lib/shop/products";
import { findPurchase, type Purchase } from "@/lib/shop/stripe";

/**
 * /projects/construct/material/[folder]/[entry]/thanks?session_id=cs_…
 *
 * Where Stripe sends the buyer after paying. It asks Stripe about the session
 * (the same `findPurchase` the download route uses) and shows one of three
 * honest states:
 *
 *   PAID         the download, the three steps, and what happens next.
 *   PROCESSING   the bank has not confirmed yet; the email will come.
 *   NOT FOUND    no such purchase, or the shop cannot reach Stripe; the
 *                buyer is told exactly who to write to.
 *
 * IT DOES NOT SEND THE EMAIL. Stripe's webhook is the one sender (see
 * lib/shop/deliver.ts): the email goes out through Gmail, which has no
 * idempotency key, so a second sender here would mean a second email.
 *
 * Never indexed, never cached: it is somebody's receipt.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

type Params = Promise<{ shelf: string; folder: string; entry: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

function productFor(shelf: string, folderId: string, slug: string): Product | undefined {
  if (shelf !== "material") return undefined;
  const entry = FOLDER_BY_ID[folderId]?.entries.find((e) => e.slug === slug);
  return entry?.product ? PRODUCTS[entry.product] : undefined;
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ThanksPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { shelf, folder, entry } = await params;
  const product = productFor(shelf, folder, entry);
  if (!product) notFound();

  const q = await searchParams;
  const sessionId = one(q.session_id);
  const downloadFailed = one(q.download) === "failed";

  let purchase: Purchase | null = null;
  try {
    purchase = await findPurchase(sessionId);
  } catch (err) {
    console.error("[shop] thanks: could not check the purchase", err);
  }
  if (purchase && purchase.product.id !== product.id) purchase = null;

  return (
    <main className="paper-bg relative min-h-screen overflow-x-clip text-[#0a0a0a]">
      <BackLink href={product.href} label={product.name} tone="ink" />
      <div className="mx-auto w-full max-w-[40rem] px-6 pb-28 pt-28 md:pb-36 md:pt-36">
        {purchase?.paid ? (
          <Paid product={product} purchase={purchase} downloadFailed={downloadFailed} />
        ) : purchase && purchase.session.status === "complete" ? (
          <Processing product={product} email={purchase.email} />
        ) : (
          <NotFound product={product} />
        )}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ *
 * THE STATES
 * ------------------------------------------------------------------ */

const label =
  "font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]";
const h1 =
  "mt-5 text-balance font-serif text-[clamp(2.8rem,9vw,4.6rem)] leading-[0.95] tracking-[-0.04em] text-[var(--ink)]";
const lede = "mt-6 text-pretty text-[1.15rem] leading-[1.55] text-[color:rgba(11,31,58,0.72)]";

function Paid({
  product,
  purchase,
  downloadFailed,
}: {
  product: Product;
  purchase: Purchase;
  downloadFailed: boolean;
}) {
  const first = purchase.name?.trim().split(/\s+/)[0];

  return (
    <>
      <header className="text-center">
        <Specimen id={product.id} className="product-hero-mark mx-auto h-auto w-[180px] md:w-[220px]" />
        <span className={`${label} mt-2 block`}>
          Paid · {product.name}
        </span>
        <h1 className={h1}>It&rsquo;s yours.</h1>
        <p className={`${lede} mx-auto max-w-[34ch]`}>
          Thank you{first ? `, ${first}` : ""}. Your download is ready
          {purchase.email ? (
            <>
              , and a copy is on its way to{" "}
              <span className="text-[var(--ink)]">{purchase.email}</span>.
            </>
          ) : (
            "."
          )}
        </p>

        <a
          href={downloadHref(purchase.session.id)}
          className="group mt-9 inline-flex min-h-[3.5rem] items-center justify-center gap-3 rounded-full bg-[var(--accent-clay-text)] px-9 py-4 text-[1.05rem] font-medium text-[var(--paper)] shadow-[0_18px_40px_-18px_rgba(185,58,38,0.75)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
        >
          <Download aria-hidden className="h-5 w-5" />
          Download {product.file.filename}
        </a>

        {downloadFailed ? (
          <p role="alert" className="mx-auto mt-5 max-w-[36ch] text-[0.98rem] leading-[1.5] text-[var(--accent-clay-text)]">
            The download didn&rsquo;t start on my side. Try once more. If it
            fails again, reply to the email and I&rsquo;ll send the folder
            directly.
          </p>
        ) : (
          <p className="mx-auto mt-5 max-w-[36ch] text-[0.95rem] leading-[1.5] text-[color:rgba(11,31,58,0.62)]">
            On your phone? Open the email on your computer. That&rsquo;s where
            the bot runs.
          </p>
        )}
      </header>

      <section aria-labelledby="steps-title" className="mt-20">
        <h2 id="steps-title" className={label}>
          Three steps
        </h2>
        <ol className="mt-5 list-none border-b border-[var(--hairline)]">
          {product.steps.map((step, i) => (
            <li
              key={i}
              className="flex items-baseline gap-5 border-t border-[var(--hairline)] py-4 text-[1.08rem] leading-[1.55] text-[var(--ink)]"
            >
              <span className="w-6 shrink-0 font-mono text-[0.78rem] tracking-[0.1em] text-[var(--accent-clay-text)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <Commands text={step} />
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-pretty text-[0.98rem] leading-[1.6] text-[color:rgba(11,31,58,0.66)]">
          {product.thanks.needs}
        </p>
      </section>

      <section aria-labelledby="next-title" className="mt-16">
        <h2 id="next-title" className={label}>
          What happens next
        </h2>
        <dl className="mt-5 border-b border-[var(--hairline)]">
          {product.thanks.next          .map(([when, what]) => (
            <div key={when} className="grid grid-cols-1 gap-1 border-t border-[var(--hairline)] py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-[1rem] text-[var(--ink)]">{when}</dt>
              <dd className="text-pretty text-[1rem] leading-[1.6] text-[color:rgba(11,31,58,0.7)]">{what}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-16 text-pretty text-[0.95rem] leading-[1.6] text-[color:rgba(11,31,58,0.66)]">
        Something not working? Reply to the email, or write to{" "}
        <a
          href={`mailto:${EMAIL}?subject=${encodeURIComponent(product.name)}`}
          className="text-[var(--ink)] underline decoration-[var(--hairline-strong)] underline-offset-4 hover:decoration-[var(--accent-clay)]"
        >
          {EMAIL}
        </a>
        . It comes straight to me.{product.thanks.footnote ? ` ${product.thanks.footnote}` : ""}
      </p>
    </>
  );
}

function Processing({ product, email }: { product: Product; email: string | null }) {
  return (
    <header className="text-center">
      <span className={label}>{product.name}</span>
      <h1 className={h1}>Almost there.</h1>
      <p className={`${lede} mx-auto max-w-[36ch]`}>
        Your bank is still confirming the payment. As soon as it clears, the
        download link comes to {email ? <span className="text-[var(--ink)]">{email}</span> : "your email"}.
        There&rsquo;s nothing else you need to do.
      </p>
      <Contact product={product} />
    </header>
  );
}

function NotFound({ product }: { product: Product }) {
  return (
    <header className="text-center">
      <span className={label}>{product.name}</span>
      <h1 className={h1}>I can&rsquo;t find that purchase.</h1>
      <p className={`${lede} mx-auto max-w-[38ch]`}>
        If you&rsquo;ve just paid, give it a minute and refresh this page. If
        it still isn&rsquo;t here, email me with the address you paid with and
        I&rsquo;ll send it to you myself.
      </p>
      <Contact product={product} />
      <a
        href={product.href}
        className="group mt-10 inline-flex items-center gap-2 border-b border-[var(--hairline-strong)] pb-1 text-[0.95rem] text-[color:rgba(11,31,58,0.72)] transition-colors hover:border-[var(--accent-clay)] hover:text-[var(--accent-clay-text)]"
      >
        <ArrowLeft aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Back to {product.name}
      </a>
    </header>
  );
}

function Contact({ product }: { product: Product }) {
  return (
    <p className="mt-8">
      <a
        href={`mailto:${EMAIL}?subject=${encodeURIComponent(`${product.name}: my purchase`)}`}
        className="inline-flex items-center rounded-full border border-[var(--hairline-strong)] px-6 py-3 text-[0.98rem] text-[var(--ink)] transition-colors hover:border-[var(--accent-clay)] hover:text-[var(--accent-clay-text)]"
      >
        {EMAIL}
      </a>
    </p>
  );
}
