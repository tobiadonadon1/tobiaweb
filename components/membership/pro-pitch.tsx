"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, LoaderCircle, X } from "lucide-react";
import { useMember } from "@/components/account/use-member";
import { PLANS, money } from "@/lib/membership/tiers";
import { productById, type Product } from "@/lib/shop/products";
import "./pro-pitch.css";

/**
 * THE PRO CARD.
 *
 * Every time someone reaches for a skill (the free one's "I want it" or its
 * email field, the paid one's Buy button), a liquid glass card asks first:
 * why take just one, when Pro opens all of them. Join Pro, Ultimate beside
 * it, and right under them, in its own colour, the way they came in: "Just
 * send me Duo Designer" or "Just buy Grok Army · €15". Taking that, or
 * closing the card, carries on exactly as before, and the card doesn't come
 * back on that button until the page is loaded again.
 *
 * Only for people without a paid plan: signed out, or on Free. A Pro,
 * Ultimate or Universal member never sees it. While the site is still
 * asking who is signed in, the click simply goes through.
 *
 * The Join buttons are the join page's own plain forms (/api/membership/join):
 * sign up first if needed, then Stripe Checkout.
 *
 * The card leans a little toward the cursor and its rim catches the light,
 * on the blurred page alone (no coloured lights behind it: Tobia, 2026-10-23);
 * kept small on purpose (Tobia: "way less reactiveness"). None of it moves
 * with reduced motion.
 */

/** Wrap an action so a non-member sees the card first. */
export function useProPitch(productId: string) {
  const member = useMember();
  const product = productById(productId);
  const [pending, setPending] = useState<null | (() => void)>(null);
  // Once per button per page load: after "Just send me" (or ×) it's out of the way.
  const passed = useRef(false);

  const eligible = member !== undefined && (member === null || member.tier === "free") && !!product;

  const gate = useCallback(
    (go: () => void) => {
      if (passed.current || !eligible) return go();
      setPending(() => go);
    },
    [eligible],
  );

  /** True when the next action would open the card (for a focus that should wait). */
  const wouldPitch = () => eligible && !passed.current;

  const node =
    pending && product ? (
      <ProPitch
        product={product}
        onContinue={() => {
          passed.current = true;
          const go = pending;
          setPending(null);
          go();
        }}
        onClose={() => {
          passed.current = true;
          setPending(null);
        }}
      />
    ) : null;

  return { gate, wouldPitch, node };
}

function copyFor(product: Product) {
  const pro = PLANS.pro.priceCents;
  if (product.free) {
    return {
      title: (
        <>
          Why take just <em>one?</em>
        </>
      ),
      sub: `${product.name} is yours either way. Pro opens the whole library: every skill, the paid ones included, plus the lessons, the components and a direct line to me.`,
      skip: `Just send me ${product.name}`,
    };
  }
  const price = money(product.priceCents, product.currency);
  const more = pro - product.priceCents;
  return {
    title: (
      <>
        Get them <em>all</em> instead.
      </>
    ),
    sub:
      `${product.name} comes included with Pro, with every other skill, the lessons, the components and a direct line to me.` +
      (more > 0 && more <= 1000 ? ` For ${money(more, "eur")} more than this one.` : ""),
    skip: `Just buy ${product.name} · ${price}`,
  };
}

function JoinForm({ tier, className, children }: { tier: "pro" | "ultimate"; className: string; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false);
  return (
    <form action="/api/membership/join" method="post" onSubmit={(e) => (busy ? e.preventDefault() : setBusy(true))}>
      <input type="hidden" name="tier" value={tier} />
      <button type="submit" disabled={busy} aria-busy={busy} className={className}>
        {busy ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : children}
      </button>
    </form>
  );
}

function ProPitch({ product, onContinue, onClose }: { product: Product; onContinue: () => void; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const veil = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  useEffect(() => void (close.current = onClose));
  const copy = copyFor(product);
  const pro = PLANS.pro;
  const ultimate = PLANS.ultimate;

  // Fade in, lock the page's scroll, Escape closes, focus lands on Join Pro and returns after.
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => setOpen(true));
    const t = window.setTimeout(() => card.current?.querySelector<HTMLElement>(".pp-cta")?.focus({ preventScroll: true }), 250);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key !== "Tab" || !card.current) return;
      const items = [...card.current.querySelectorAll<HTMLElement>("button:not([disabled])")];
      if (!items.length) return;
      const [a, z] = [items[0], items[items.length - 1]];
      const wrapTo = e.shiftKey ? (document.activeElement === a ? z : null) : document.activeElement === z ? a : null;
      if (wrapTo) {
        e.preventDefault();
        wrapTo.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      // Not back into an email field: focusing it would only ask again.
      if (back && back.tagName !== "INPUT") back.focus?.({ preventScroll: true });
    };
  }, []);

  // The light: a small lean toward the cursor and a soft highlight that follows it.
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0, ty = 0, x = 0, y = 0, px = 0.5, py = 0.2, cx = 0.5, cy = 0.2, raf = 0;
    const el = veil.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = card.current?.getBoundingClientRect();
      if (!r) return;
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
    };
    const leave = () => ((tx = 0), (ty = 0), (px = 0.5), (py = 0.2));
    const frame = () => {
      x += (tx - x) * 0.04;
      y += (ty - y) * 0.04;
      cx += (px - cx) * 0.06;
      cy += (py - cy) * 0.06;
      const c = card.current;
      if (c) {
        if (!still && tilt.current) tilt.current.style.transform = `perspective(1000px) rotateY(${x * 1.5}deg) rotateX(${-y * 1.5}deg)`;
        c.style.setProperty("--pp-mx", `${cx * 100}%`);
        c.style.setProperty("--pp-my", `${cy * 100}%`);
        c.style.setProperty("--pp-ang", `${(Math.atan2(cy - 0.5, cx - 0.5) * 180) / Math.PI + 50}deg`);
      }
      raf = requestAnimationFrame(frame);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return createPortal(
    <div
      ref={veil}
      className="pp-veil"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pp-title"
      onClick={(e) => e.target === veil.current && onClose()}
      // A portal still bubbles through React to whatever rendered it (an email form): keep the card's events here.
      onSubmit={(e) => e.stopPropagation()}
    >
      <div aria-hidden className="pp-dim" onClick={onClose} />
      <div ref={tilt} className="pp-tilt">
        <article ref={card} className="pp-card">
          <button type="button" className="pp-close" aria-label="Close" onClick={onClose}>
            <X aria-hidden className="h-4 w-4" />
          </button>
          <h2 id="pp-title" className="pp-title">
            {copy.title}
          </h2>
          <p className="pp-sub">{copy.sub}</p>
          <ul className="pp-perks">
            <li>Every skill, paid ones too</li>
            <li>The Masterclass</li>
            <li>Live Q&amp;A with me</li>
            <li className="pp-more">and more</li>
          </ul>
          <div className="pp-row">
            <JoinForm tier="pro" className="pp-cta">
              Join {pro.name}
              <small>{money(pro.priceCents, pro.currency)}/mo</small>
              <ArrowRight aria-hidden className="h-4 w-4" />
            </JoinForm>
            <JoinForm tier="ultimate" className="pp-alt">
              {ultimate.name} <small>{money(ultimate.priceCents, ultimate.currency)}</small>
            </JoinForm>
          </div>
          <button type="button" className="pp-skip" onClick={onContinue}>
            {copy.skip}
          </button>
        </article>
      </div>
    </div>,
    document.body,
  );
}
