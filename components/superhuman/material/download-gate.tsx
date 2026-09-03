"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";

/**
 * THE ONE THING BEFORE THE DOWNLOAD.
 *
 * A skill is free and stays free. This asks for an address on the way past,
 * and it is built so that asking costs the reader as little as possible:
 *
 *   ONE FIELD, and it is already focused. Anything else on this card would be
 *   a form, and a form in front of a free file is a toll booth.
 *   IT SAYS WHY, in the hand. The reassurance is the whole reason somebody
 *   types the address rather than closing the card, so it is written the way
 *   a person would say it, not as a privacy notice.
 *   THE FILE ARRIVES EVEN IF THE SAVE FAILS. The download fires whatever the
 *   API returns. Losing an address is my problem; it is never allowed to
 *   become the reader's problem.
 *
 * THE DIALOG IS A REAL DIALOG. Escape closes it, the backdrop closes it,
 * focus moves in on open and back to the button that opened it on close, and
 * it is `aria-modal` with a labelled heading. A light popup can be all of that
 * and still be light; the weight people object to is the animation and the
 * dimming, not the semantics.
 */
export function DownloadGate({
  href,
  label,
  title,
  className = "",
}: {
  /** The file. */
  href: string;
  /** The button's own words. */
  label: string;
  /** What is being downloaded, for the card's heading. */
  title: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const opener = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const card = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setBusy(false);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  /** Saves the file without navigating away from the page. */
  const save = useCallback(() => {
    const a = document.createElement("a");
    a.href = href;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [href]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "superhuman",
          interest: "material",
        }),
      });
    } catch {
      // Deliberately swallowed. See the note above: the file is not held
      // hostage to my ability to store an address.
    }
    save();
    setDone(true);
    setBusy(false);
    window.setTimeout(close, 1400);
  };

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={() => {
          setDone(false);
          setOpen(true);
        }}
        className={className}
      >
        <Download className="h-3.5 w-3.5" />
        {label}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center px-5"
          onMouseDown={(e) => {
            if (!card.current?.contains(e.target as Node)) close();
          }}
        >
          {/* Light. A wash, not a blackout: the page stays where it was and
              the card reads as something laid on top of it. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[rgba(11,31,58,0.18)] backdrop-blur-[3px]"
          />

          <div
            ref={card}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dl-title"
            /* PAPER, NOT A BORDERED BOX.
             *
             * It had a clay outline all the way round, which turned the card
             * into a warning dialog: a saturated rectangle drawn around a
             * saturated button is the page shouting twice. What replaces it is
             * a sheet. Slightly translucent so the page shows through and it
             * reads as laid ON the page rather than cut into it, a soft rounded
             * corner, one hairline at the top edge where light would catch a
             * real sheet, and a long low shadow doing the work the border was
             * doing badly. The only saturated thing left on it is the button,
             * which is the only thing you are meant to press. */
            className="relative w-full max-w-[26rem] rounded-2xl border border-[rgba(250,248,242,0.6)] bg-[rgba(250,248,242,0.82)] p-7 shadow-[0_30px_70px_-28px_rgba(11,31,58,0.45)] backdrop-blur-xl md:p-8"
            style={{
              boxShadow:
                "0 30px 70px -28px rgba(11,31,58,0.45), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full p-1.5 text-[color:rgba(11,31,58,0.5)] transition-colors hover:bg-[rgba(206,70,49,0.08)] hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)]"
            >
              <X className="h-4 w-4" />
            </button>

            {done ? (
              <div className="py-6 text-center">
                <p
                  id="dl-title"
                  className="font-hand text-[1.8rem] leading-none text-[var(--accent-clay-text)]"
                >
                  saved. it is downloading
                </p>
                <p className="mt-3 text-[0.95rem] text-[color:rgba(11,31,58,0.66)]">
                  Drop it in your skills folder and type /{title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.
                </p>
              </div>
            ) : (
              <>
                <h2
                  id="dl-title"
                  className="pr-8 font-serif text-[1.5rem] leading-[1.1] tracking-[-0.03em] text-[var(--ink)]"
                >
                  One thing first.
                </h2>

                <p className="mt-3 font-hand text-[1.25rem] leading-[1.25] text-[var(--accent-clay-text)]">
                  no spam, I promise. I am just keeping addresses for when
                  something bigger comes out.
                </p>

                <form onSubmit={submit} className="mt-6">
                  <label htmlFor="dl-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    ref={field}
                    id="dl-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@work.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-[var(--hairline-strong)] bg-transparent pb-2 text-[1rem] text-[var(--ink)] caret-[var(--accent-clay)] outline-none transition-colors placeholder:text-[color:rgba(11,31,58,0.38)] focus:border-[var(--accent-clay)]"
                  />

                  <button
                    type="submit"
                    disabled={busy}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--accent-clay)] px-6 py-3.5 text-[0.95rem] text-[var(--paper)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
                  >
                    <Download className="h-4 w-4" />
                    {busy ? "One second" : `Download ${title}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
