import type { Product } from "@/lib/shop/products";
import { BuyForm } from "./buy-form";
import { Commands } from "./commands";

/**
 * WHERE A FREE SKILL HAS ITS DOWNLOAD, A PAID ONE HAS THIS.
 *
 * Same place on the page and the same furniture as SkillContents (the folder,
 * then how to install it, then the one button), so a skill for sale reads as
 * a skill rather than as an advert that wandered into the folder. The
 * differences are the price and what the button does.
 *
 * `id` is the closing buy target the phone's sticky buy card watches for, so
 * the card steps aside once this is on screen.
 */
export function ProductSection({ product, id }: { product: Product; id: string }) {
  return (
    <section id={id} className="mt-20 scroll-mt-28 border-t border-[var(--hairline)] pt-12 md:mt-24">
      {product.contents ? (
        <>
          <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
            In the folder
          </h2>
          <ul className="mt-6 list-none border-t border-[var(--hairline)]">
            {product.contents.map(([name, what]) => (
              <li
                key={name}
                className="grid grid-cols-1 gap-1 border-b border-[var(--hairline)] py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-6"
              >
                <span className="text-[0.98rem] text-[var(--accent-clay-text)]">{name}</span>
                <span className="text-pretty text-[0.98rem] leading-[1.55] text-[color:rgba(11,31,58,0.72)]">
                  {what}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h3 className="mt-12 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
        Installing it
      </h3>
      <ol className="mt-5 list-none border-b border-[var(--hairline)]">
        {product.steps.map((step, i) => (
          <li
            key={i}
            className="flex items-baseline gap-5 border-t border-[var(--hairline)] py-4 text-[1.04rem] leading-[1.55] text-[var(--ink)]"
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
      <p className="mt-5 max-w-[58ch] text-pretty text-[1.02rem] leading-[1.7] text-[color:rgba(11,31,58,0.68)]">
        <Commands text={product.email.after[0]} />
      </p>

      {/* The one button, with the price on it and the facts under it. */}
      <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-[var(--hairline)] bg-[rgba(255,255,255,0.45)] p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
        <div>
          <p className="font-serif text-[2.4rem] leading-none tracking-[-0.04em] text-[var(--ink)]">
            {product.priceLabel}
          </p>
          <p className="mt-2 text-[0.92rem] text-[color:rgba(11,31,58,0.62)]">
            One payment. Instant download, and the folder is emailed to you.
          </p>
        </div>
        <BuyForm productId={product.id} price={product.priceLabel} />
      </div>
    </section>
  );
}
