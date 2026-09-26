"use client";

import { useId, useState } from "react";
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
  className = "",
}: {
  productId: string;
  align?: "center" | "start";
  /** Show the one-line ask above the field. */
  prompt?: boolean;
  className?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "bad-email" | "too-many" | "failed">("idle");

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

  if (state === "sent") {
    return (
      <div role="status" className={`flex flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}>
        <p className="inline-flex items-center gap-2.5 text-[1.15rem] text-[#f4f2ec]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f07a5f] text-[#050507]">
            <Check aria-hidden className="h-4 w-4" />
          </span>
          Sent. Check your inbox.
        </p>
        <p className="mt-2 max-w-[36ch] text-[0.95rem] leading-[1.5] text-[rgba(244,242,236,0.6)]">
          It&rsquo;s on its way to <span className="text-[#f4f2ec]">{email}</span>. If it&rsquo;s
          not there in a minute, look in Promotions or Spam.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`flex w-full max-w-[26rem] flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}
    >
      {prompt ? (
        <label htmlFor={id} className="mb-3 text-[1rem] leading-[1.45] text-[rgba(244,242,236,0.85)] md:text-[1.05rem]">
          Let me know where you want me to send the product.
        </label>
      ) : (
        <label htmlFor={id} className="sr-only">
          Your email
        </label>
      )}
      <div className="flex w-full items-center gap-1.5 rounded-full border border-[rgba(244,242,236,0.18)] bg-[rgba(244,242,236,0.06)] p-1.5 focus-within:border-[rgba(244,242,236,0.5)]">
        <input
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
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[1rem] text-[#f4f2ec] outline-none placeholder:text-[rgba(244,242,236,0.35)]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent-clay-text)] px-5 py-2.5 text-[0.98rem] font-medium text-[var(--paper)] transition-transform duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4f2ec]"
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
      <p role="alert" className="mt-3 min-h-[1.2em] text-[0.88rem] text-[#f07a5f]">
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
