"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { SHOP_EMAIL } from "@/lib/shop/products";

/**
 * "LET ME KNOW WHERE YOU WANT ME TO SEND THE PRODUCT."
 *
 * The free product's whole checkout: one address, one button, then the
 * product arrives by email (app/api/free). The same words and the same flow
 * everywhere it appears on the page, so a visitor never wonders whether the
 * form at the bottom is a different thing from the one at the top.
 *
 * It says plainly what happened: sent (and where to look), a typo in the
 * address, too many tries, or a failure with a way to reach Tobia. The
 * hidden `website` field is a honeypot for bots; people never see it.
 */
export function FreeClaim({
  productId,
  align = "center",
  prompt = true,
  tone = "dark",
  reveal,
  className = "",
}: {
  productId: string;
  /**
   * Start as one button with this label ("I want it"); the address field
   * opens in its place on click. Without it, the field shows from the start.
   */
  reveal?: string;
  align?: "center" | "start";
  /** "light" for a page on paper (App Designer), "saffron" for Web Designer's
      colour field, "forest" for App Launcher's green field, "dark" for the
      black pages. */
  tone?: "dark" | "light" | "saffron" | "forest" | "cobalt";
  /** Show the one-line ask above the field. */
  prompt?: boolean;
  className?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "bad-email" | "too-many" | "failed">("idle");
  const [open, setOpen] = useState(!reveal);
  const input = useRef<HTMLInputElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  // The phone's sticky bar links to #claim: arriving there means "I want it"
  // was already tapped once, so open the field instead of asking twice.
  useEffect(() => {
    if (!reveal) return;
    const onHash = () => {
      if (window.location.hash !== "#claim") return;
      const host = input.current?.closest("#claim") ?? document.getElementById("claim");
      if (!host || !host.contains(wrap.current)) return;
      setOpen(true);
      requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [reveal]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/free", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product: productId, email, website: trap }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (body.ok) setState("sent");
      else if (body.error === "bad-email") setState("bad-email");
      else if (body.error === "too-many") setState("too-many");
      else setState("failed");
    } catch {
      setState("failed");
    }
  };

  const center = align === "center";
  // "light" decides the input's autofill colours: the field is pale on all three.
  const light = tone === "light" || tone === "saffron" || tone === "forest" || tone === "cobalt";
  const t = tone === "cobalt"
    ? {
        ink: "text-white",
        soft: "text-[rgba(255,255,255,0.78)]",
        ask: "text-[rgba(255,255,255,0.9)]",
        field: "border-transparent bg-white shadow-[0_18px_40px_-20px_rgba(0,0,40,0.6)] focus-within:border-white",
        input: "text-[#0b1a6b] placeholder:text-[rgba(11,26,107,0.45)]",
        ring: "focus-visible:outline-white",
        check: "bg-white text-[#1636e6]",
        error: "text-[#ffd9cf]",
        button: "bg-[#d4361a] text-white",
      }
    : tone === "forest"
    ? {
        ink: "text-[#f6f1e4]",
        soft: "text-[rgba(246,241,228,0.72)]",
        ask: "text-[rgba(246,241,228,0.88)]",
        field:
          "border-transparent bg-[#f6f1e4] shadow-[0_14px_34px_-18px_rgba(0,0,0,0.55)] focus-within:border-[#f6f1e4]",
        input: "text-[#0e2a20] placeholder:text-[rgba(14,42,32,0.45)]",
        ring: "focus-visible:outline-[#f6f1e4]",
        check: "bg-[#f6f1e4] text-[#0e2a20]",
        error: "text-[#ffd2c6]",
        button: "bg-[#c43d27] text-[#fff8ef]",
      }
    : tone === "saffron"
    ? {
        ink: "text-[#0b1f3a]",
        soft: "text-[#3a2c14]",
        ask: "text-[#3a2c14]",
        field:
          "border-[rgba(11,31,58,0.28)] bg-[#fdf6ea] shadow-[0_1px_0_rgba(11,31,58,0.05),0_14px_34px_-18px_rgba(58,44,20,0.45)] focus-within:border-[#0b1f3a]",
        input: "text-[#0b1f3a] placeholder:text-[rgba(11,31,58,0.45)]",
        ring: "focus-visible:outline-[#0b1f3a]",
        check: "bg-[#0b1f3a] text-[#fdf6ea]",
        error: "text-[#7a1d0c]",
        button: "bg-[#0b1f3a] text-[#fdf6ea]",
      }
    : light
    ? {
        ink: "text-[var(--ink)]",
        soft: "text-[color:rgba(11,31,58,0.62)]",
        ask: "text-[color:rgba(11,31,58,0.78)]",
        field:
          "border-[var(--hairline-strong)] bg-white shadow-[0_1px_0_rgba(11,31,58,0.04),0_12px_32px_-18px_rgba(11,31,58,0.28)] focus-within:border-[color:rgba(11,31,58,0.5)]",
        input: "text-[var(--ink)] placeholder:text-[color:rgba(11,31,58,0.38)]",
        ring: "focus-visible:outline-[var(--ink)]",
        check: "bg-[var(--accent-clay-text)] text-[var(--paper)]",
        error: "text-[var(--accent-clay-text)]",
        button: "bg-[var(--accent-clay-text)] text-[var(--paper)]",
      }
    : {
        ink: "text-[#f4f2ec]",
        soft: "text-[rgba(244,242,236,0.6)]",
        ask: "text-[rgba(244,242,236,0.85)]",
        field: "border-[rgba(244,242,236,0.18)] bg-[rgba(244,242,236,0.06)] focus-within:border-[rgba(244,242,236,0.5)]",
        input: "text-[#f4f2ec] placeholder:text-[rgba(244,242,236,0.35)]",
        ring: "focus-visible:outline-[#f4f2ec]",
        check: "bg-[#f07a5f] text-[#050507]",
        error: "text-[#f07a5f]",
        button: "bg-[var(--accent-clay-text)] text-[var(--paper)]",
      };

  if (state === "sent") {
    return (
      <div role="status" className={`flex flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}>
        <p className={`inline-flex items-center gap-2.5 text-[1.15rem] ${t.ink}`}>
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${t.check}`}>
            <Check aria-hidden className="h-4 w-4" />
          </span>
          Sent. Check your inbox.
        </p>
        <p className={`mt-2 max-w-[36ch] text-[0.95rem] leading-[1.5] ${t.soft}`}>
          It&rsquo;s on its way to <span className={t.ink}>{email}</span>. If it&rsquo;s
          not there in a minute, look in Promotions or Spam.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div ref={wrap} className={`flex w-full max-w-[26rem] flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            // The field takes the button's place; put the cursor in it.
            requestAnimationFrame(() => input.current?.focus());
          }}
          className={`group inline-flex items-center gap-2.5 rounded-full border border-transparent px-7 py-3.5 text-[1.05rem] font-medium ${t.button} transition-transform duration-200 hover:scale-[1.03] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${t.ring}`}
        >
          {reveal}
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
        <p className={`mt-3 min-h-[1.2em] text-[0.88rem] ${t.soft}`}>Free. It arrives by email.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`flex w-full max-w-[26rem] flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}
    >
      {prompt ? (
        <label htmlFor={id} className={`mb-3 text-[1rem] leading-[1.45] md:text-[1.05rem] ${light ? "text-balance" : ""} ${t.ask}`}>
          Let me know where you want me to send the product.
        </label>
      ) : (
        <label htmlFor={id} className="sr-only">
          Your email
        </label>
      )}
      <div className={`flex w-full items-center gap-1.5 rounded-full border p-1.5 ${t.field}`}>
        <input
          ref={input}
          id={id}
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle" && state !== "sending") setState("idle");
          }}
          className={`lx-input ${light ? "lx-input--light" : ""} min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-[1rem] outline-none ${t.input}`}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className={`group inline-flex shrink-0 items-center gap-2 rounded-full border border-transparent px-5 py-2.5 text-[0.98rem] font-medium ${t.button} transition-transform duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${t.ring}`}
        >
          {state === "sending" ? (
            <>
              <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              Send
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      {/* The honeypot. Off screen, out of the tab order, ignored by people. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      <p role="alert" className={`mt-3 min-h-[1.2em] text-[0.88rem] ${t.error}`}>
        {state === "bad-email"
          ? "That address doesn't look right. Mind checking it?"
          : state === "too-many"
            ? "Already on its way. Give it a few minutes, then check Spam."
            : state === "failed"
              ? `That didn't go through. Try again, or write to ${SHOP_EMAIL}.`
              : ""}
      </p>
    </form>
  );
}
