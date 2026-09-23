"use client";

import { useEffect, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

/**
 * THE BUY BUTTON.
 *
 * A real form posting to /api/checkout, so it works before hydration, with
 * JavaScript off, and on a page opened before the last deploy. JavaScript
 * only adds two things on top:
 *
 *   A PENDING STATE. Stripe takes a second to answer, and a button that does
 *   nothing for a second gets pressed again. It says "Opening checkout" and
 *   stops taking clicks. If the buyer comes back from Stripe with the back
 *   button, the page may be restored from the browser's cache still pending,
 *   so `pageshow` puts it back.
 *
 *   THE FAILURE, IN WORDS. If checkout could not be created, the route sends
 *   the buyer back here with ?checkout=error, and the first form on the page
 *   says so, with the one thing to do about it. Read on the client, so the
 *   page itself stays static and fast.
 *
 * THE FILL IS THE DARKER CLAY. Paper on #ce4631 is 4.35:1, just under AA for
 * text this size; on --accent-clay-text it passes. Same colour to the eye,
 * and the button is the one place on the page contrast cannot be traded.
 */
export function BuyForm({
  productId,
  price,
  tone = "paper",
  reportErrors = false,
  compact = false,
  className = "",
}: {
  productId: string;
  price: string;
  tone?: "paper" | "ink";
  /** Only one form on the page shows the checkout error, not every copy. */
  reportErrors?: boolean;
  /** The sticky card's size: shorter button, shorter words. */
  compact?: boolean;
  className?: string;
}) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reset = (e: PageTransitionEvent) => {
      if (e.persisted) setPending(false);
    };
    window.addEventListener("pageshow", reset);
    if (reportErrors) {
      const q = new URLSearchParams(window.location.search);
      // Reading the URL once on mount is the point: the page is static, and
      // this flag only exists after a failed redirect from the checkout route.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (q.get("checkout") === "error") setFailed(true);
    }
    return () => window.removeEventListener("pageshow", reset);
  }, [reportErrors]);

  return (
    <form
      action="/api/checkout"
      method="post"
      onSubmit={(e) => {
        if (pending) {
          e.preventDefault();
          return;
        }
        setPending(true);
        setFailed(false);
      }}
      className={className}
    >
      <input type="hidden" name="product" value={productId} />

      <button
        type="submit"
        aria-busy={pending}
        disabled={pending}
        className={`group inline-flex items-center justify-center rounded-full bg-[var(--accent-clay-text)] font-medium ${
          compact ? "min-h-[2.9rem] gap-2 px-5 py-2.5 text-[0.95rem]" : "min-h-[3.5rem] gap-3 px-9 py-4 text-[1.05rem]"
        } tracking-[-0.005em] text-[var(--paper)] shadow-[0_18px_40px_-18px_rgba(185,58,38,0.75)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-18px_rgba(185,58,38,0.85)] active:translate-y-0 disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
          tone === "ink" ? "focus-visible:outline-[var(--paper)]" : "focus-visible:outline-[var(--ink)]"
        }`}
      >
        {pending ? (
          <>
            <LoaderCircle aria-hidden className="h-5 w-5 animate-spin" />
            {compact ? "Opening" : "Opening checkout"}
          </>
        ) : (
          <>
            {compact ? `Buy · ${price}` : `Buy it for ${price}`}
            <ArrowRight
              aria-hidden
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      {failed ? (
        <p
          role="alert"
          className={`mx-auto mt-5 max-w-[30ch] text-pretty text-[0.95rem] leading-[1.5] ${
            tone === "ink" ? "text-[var(--paper)]" : "text-[var(--accent-clay-text)]"
          }`}
        >
          Checkout didn&rsquo;t open. Please try again in a moment.
        </p>
      ) : null}
    </form>
  );
}
