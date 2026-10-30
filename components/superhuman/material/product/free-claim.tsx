"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Check, Download, LoaderCircle } from "lucide-react";
import { SHOP_EMAIL, productById } from "@/lib/shop/products";
import { ACCOUNT_HREF } from "@/components/account/links";
import { startDownload, useMember } from "@/components/account/use-member";
import { NewsletterBox, rememberSubscribed, useKnownSubscribed } from "@/components/account/newsletter";
import { useProPitch } from "@/components/membership/pro-pitch";

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
 *
 * SIGNED IN, IT IS ONE CLICK. A Construct member (components/account) sees
 * the same button, and pressing it downloads the product there and then:
 * no field, no email to wait for.
 *
 * THE NEWSLETTER BOX sits right under the button, in every state that has
 * one, until this visitor has said yes (components/account/newsletter.tsx):
 * never ticked for them, never required. A tick rides along with the claim.
 *
 * THE PRO CARD comes first (components/membership/pro-pitch.tsx): the
 * reveal button, the first touch of the email field, a send without one, and
 * a Free member's Download all open it once; "Just send me …" carries on.
 */
export function FreeClaim({
  productId,
  align = "center",
  prompt = true,
  tone = "dark",
  reveal,
  face,
  hold = 0,
  fine = false,
  buttonClassName = "",
  quiet = false,
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
      black pages, "ink" for paper with a black button (Viral Machine). */
  tone?: "dark" | "light" | "ink" | "saffron" | "forest" | "cobalt" | "ember" | "night" | "violet" | "gold";
  /** The newsletter consent as very small fine print (Duo Designer). */
  fine?: boolean;
  /** Show the one-line ask above the field. */
  prompt?: boolean;
  /** The button's whole content, in place of its label and icon (Viral Machine's sleeping bot, viral-machine-cta.tsx). */
  face?: React.ReactNode;
  /** Extra classes for that button. */
  buttonClassName?: string;
  /** Drop the "Free. It downloads now…" line under the button, for a page that says it elsewhere (Meta Ads). */
  quiet?: boolean;
  /**
   * Milliseconds the button stays after a click before the form (or the
   * download) takes its place, so what it says in its speech bubble is said
   * on the pill. Each further click starts the wait again.
   */
  hold?: number;
  className?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<
    "idle" | "sending" | "sent" | "downloaded" | "bad-email" | "too-many" | "failed"
  >("idle");
  const member = useMember();
  const pathname = usePathname();
  const [open, setOpen] = useState(!reveal);
  const [news, setNews] = useState(false);
  const known = useKnownSubscribed();
  // Members: their own flag. Everyone else: whether this device said yes.
  // While either is still unknown the box keeps its place, unseen.
  const askNews = member ? member.newsletter === false : member === null && known === false;
  const waitNews = member === undefined || (member === null && known === undefined);
  const pitch = useProPitch(productId);
  const input = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const holding = useRef(0);
  useEffect(() => () => window.clearTimeout(holding.current), []);
  const afterHold = (go: () => void) => {
    if (!hold) return go();
    window.clearTimeout(holding.current);
    holding.current = window.setTimeout(go, hold);
  };

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
    // Sent without ever touching the field (autofill and Enter): the card still comes first.
    if (pitch.wouldPitch()) return pitch.gate(() => form.current?.requestSubmit());
    setState("sending");
    try {
      const res = await fetch("/api/free", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product: productId, email, website: trap, newsletter: news }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; download?: string };
      if (body.ok && news) rememberSubscribed();
      // An instant product (products.ts) answers with its link: download it here, the email is a copy.
      if (body.ok && body.download) {
        startDownload(body.download);
        setState("downloaded");
      } else if (body.ok) setState("sent");
      else if (body.error === "bad-email") setState("bad-email");
      else if (body.error === "too-many") setState("too-many");
      else setState("failed");
    } catch {
      setState("failed");
    }
  };

  const take = async () => {
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/free", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product: productId, newsletter: news }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; download?: string };
      if (body.ok && news) rememberSubscribed();
      if (body.ok && body.download) {
        startDownload(body.download);
        setState("downloaded");
      } else setState("failed");
    } catch {
      setState("failed");
    }
  };

  const center = align === "center";
  const signIn = (cls: string) => (
    <Link href={`${ACCOUNT_HREF}?next=${encodeURIComponent(pathname ?? "/projects/construct")}`} className={`underline underline-offset-4 ${cls}`}>
      sign in
    </Link>
  );
  // "light" decides the input's autofill colours: the field is pale on all three.
  const light = tone === "light" || tone === "ink" || tone === "saffron" || tone === "forest" || tone === "cobalt" || tone === "ember" || tone === "night" || tone === "violet" || tone === "gold";
  // "ember": Motion Designer's orange field, black type, a black button, a white field.
  const t = tone === "ember"
    ? {
        ink: "text-[#111111]",
        soft: "text-[rgba(17,17,17,0.78)]",
        ask: "text-[rgba(17,17,17,0.88)]",
        field: "border-transparent bg-white shadow-[0_18px_40px_-20px_rgba(60,15,0,0.55)] focus-within:border-[#111111]",
        input: "text-[#111111] placeholder:text-[rgba(17,17,17,0.45)]",
        ring: "focus-visible:outline-[#111111]",
        check: "bg-[#111111] text-white",
        error: "text-[#2a0700] font-semibold",
        button: "bg-[#111111] text-white hover:bg-black",
        // A white box with a black outline and black words: a see-through outline got lost in the orange.
        box: ["#111111", "#ffffff", "#111111", "#ffffff"],
        boxText: "text-[#111111] font-medium",
      }
    : tone === "night"
    ? {
        // Shorts Animator's painted night: white words, a white field, the sunset's saffron button.
        ink: "text-white",
        soft: "text-[rgba(255,255,255,0.78)]",
        ask: "text-[rgba(255,255,255,0.9)]",
        field: "border-transparent bg-white shadow-[0_18px_40px_-20px_rgba(0,0,30,0.7)] focus-within:border-white",
        input: "text-[#14254F] placeholder:text-[rgba(20,37,79,0.45)]",
        ring: "focus-visible:outline-white",
        check: "bg-white text-[#14254F]",
        error: "text-[#ffd9cf]",
        button: "bg-[#F6B23C] text-[#1b1206] hover:bg-[#ffc257]",
        box: ["#ffffff", "#14254F", "rgba(255,255,255,0.75)"],
      }
    : tone === "gold"
    ? {
        // The $1K Bot's black page: white words, a white field, a gold button with black words.
        ink: "text-[#f4f2ec]",
        soft: "text-[rgba(244,242,236,0.66)]",
        ask: "text-[rgba(244,242,236,0.9)]",
        field: "border-transparent bg-white shadow-[0_18px_40px_-20px_rgba(242,205,107,0.35)] focus-within:border-[#f2cd6b]",
        input: "text-[#0a0a0a] placeholder:text-[rgba(10,10,10,0.42)]",
        ring: "focus-visible:outline-[#f2cd6b]",
        check: "bg-[#f2cd6b] text-[#140d00]",
        error: "text-[#ffb4a1] font-semibold",
        // .okb-btn (one-k-bot.css): foil with a lit edge, on the one page that uses this tone.
        button: "okb-btn text-[#140d00]",
        box: ["#f2cd6b", "#140d00", "rgba(244,242,236,0.5)"],
      }
    : tone === "violet"
    ? {
        // Reel Bot's violet field: white words, a white field, a lime button with black words.
        ink: "text-white",
        soft: "text-[rgba(255,255,255,0.8)]",
        ask: "text-[rgba(255,255,255,0.92)]",
        field: "border-transparent bg-white shadow-[0_18px_40px_-20px_rgba(20,0,80,0.6)] focus-within:border-white",
        input: "text-[#1d1060] placeholder:text-[rgba(29,16,96,0.45)]",
        ring: "focus-visible:outline-white",
        check: "bg-white text-[#5b3df6]",
        error: "text-[#ffe0d6] font-semibold",
        button: "bg-[#e4ff4f] text-[#111111] hover:bg-[#eeff7a]",
        box: ["#ffffff", "#5b3df6", "rgba(255,255,255,0.75)"],
      }
    : tone === "cobalt"
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
        box: ["#ffffff", "#1636e6", "rgba(255,255,255,0.75)"],
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
        box: ["#f6f1e4", "#0e2a20", "rgba(246,241,228,0.7)"],
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
        box: ["#0b1f3a", "#fdf6ea", "rgba(11,31,58,0.55)"],
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
        check: tone === "ink" ? "bg-[#16171B] text-white" : "bg-[var(--accent-clay-text)] text-[var(--paper)]",
        error: "text-[var(--accent-clay-text)]",
        button: tone === "ink" ? "bg-[#16171B] text-white hover:bg-black" : "bg-[var(--accent-clay-text)] text-[var(--paper)]",
        box: tone === "ink" ? ["#16171B", "#ffffff", "rgba(11,31,58,0.5)"] : ["var(--accent-clay-text)", "var(--paper)", "rgba(11,31,58,0.5)"],
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
        box: ["#f07a5f", "#050507", "rgba(244,242,236,0.5)"],
      };

  // Right under the button, wherever there is one.
  const newsBox =
    askNews || waitNews ? (
      <NewsletterBox
        checked={news}
        onChange={setNews}
        soft={("boxText" in t && t.boxText) || t.soft}
        accent={t.box[0]}
        mark={t.box[1]}
        line={t.box[2]}
        fill={t.box[3]}
        center={center}
        fine={fine}
        hidden={!askNews}
        className="mt-3.5"
      />
    ) : null;

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

  if (state === "downloaded") {
    return (
      <div role="status" className={`flex flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}>
        <p className={`inline-flex items-center gap-2.5 text-[1.15rem] ${t.ink}`}>
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${t.check}`}>
            <Check aria-hidden className="h-4 w-4" />
          </span>
          Downloading now.
        </p>
        <p className={`mt-2 max-w-[36ch] text-[0.95rem] leading-[1.5] ${t.soft}`}>
          Check your Downloads folder.{" "}
          {member ? "You can come back and get it again any time." : "The link is in your inbox too, for later."}
        </p>
      </div>
    );
  }

  if (member) {
    return (
      <div ref={wrap} className={`flex w-full max-w-[26rem] flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}>
        <button
          type="button"
          onClick={() => afterHold(() => pitch.gate(take))}
          disabled={state === "sending"}
          className={`group inline-flex items-center gap-2.5 rounded-full border border-transparent px-7 py-3.5 text-[1.05rem] font-medium ${t.button} transition-transform duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${t.ring} ${buttonClassName}`}
        >
          {face ?? (
            <>
              {state === "sending" ? (
                <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" />
              ) : (
                <Download aria-hidden className="h-4 w-4" />
              )}
              {reveal ?? "Download"}
            </>
          )}
        </button>
        {newsBox}
        <p role={state === "failed" ? "alert" : undefined} className={`mt-3 min-h-[1.2em] text-balance text-[0.88rem] ${state === "failed" ? t.error : t.soft}`}>
          {state === "failed"
            ? `That didn't work. Try again, or write to ${SHOP_EMAIL}.`
            : <>Downloads now. Signed in as <span className={t.ink}>{member.email}</span>.</>}
        </p>
        {pitch.node}
      </div>
    );
  }

  // Free with an account (Copycat Detective): no email form. The button goes
  // to sign in or create an account, which comes straight back here.
  if (productById(productId)?.accountOnly) {
    const back = `${ACCOUNT_HREF}?mode=signup&next=${encodeURIComponent(`${pathname ?? "/projects/construct"}#claim`)}`;
    return (
      <div ref={wrap} className={`flex w-full max-w-[26rem] flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}>
        <Link
          href={back}
          aria-busy={member === undefined}
          className={`group inline-flex items-center gap-2.5 rounded-full border border-transparent px-7 py-3.5 text-[1.05rem] font-medium ${t.button} transition-transform duration-200 hover:scale-[1.03] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${t.ring} ${buttonClassName}`}
        >
          {reveal ?? "Get it free"}
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
        <p className={`mt-3 min-h-[1.2em] text-[0.88rem] ${t.soft}`}>
          Free with an account. Create one once (or {signIn(t.ink)}), then it downloads.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div ref={wrap} className={`flex w-full max-w-[26rem] flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}>
        <button
          type="button"
          onClick={() =>
            afterHold(() =>
              pitch.gate(() => {
                setOpen(true);
                // The field takes the button's place; put the cursor in it.
                requestAnimationFrame(() => input.current?.focus());
              }),
            )
          }
          className={`group inline-flex items-center gap-2.5 rounded-full border border-transparent px-7 py-3.5 text-[1.05rem] font-medium ${t.button} transition-transform duration-200 hover:scale-[1.03] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${t.ring} ${buttonClassName}`}
        >
          {face ?? (
            <>
              {reveal}
              <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
        {newsBox}
        {quiet ? null : (
          <p className={`mt-3 min-h-[1.2em] text-[0.88rem] ${t.soft}`}>
            {productById(productId)?.instant ? "Free. It downloads now, and a copy comes by email." : "Free. It arrives by email."}
          </p>
        )}
        {pitch.node}
      </div>
    );
  }

  return (
    <>
      <form
        ref={form}
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
            onFocus={(e) => {
              if (!pitch.wouldPitch()) return;
              e.currentTarget.blur();
              pitch.gate(() => requestAnimationFrame(() => input.current?.focus()));
            }}
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
        {newsBox}
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
      {pitch.node}
    </>
  );
}
