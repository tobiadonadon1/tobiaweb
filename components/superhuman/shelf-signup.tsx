"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { EMAIL, mailto, type ShelfId } from "./shelf-data";

/**
 * THE CARD TAKES THE ADDRESS.
 *
 * This used to be a page. You clicked a card, read three hundred words about
 * one family, and left an email at the bottom of it. The card is the choice,
 * so the field belongs on the card: no route, no chooser, nothing to navigate.
 *
 * WHY IT OPENS INSTEAD OF SITTING THERE. Three fields open at once on three
 * cards reads as a signup wall, and the shelf's job is to show three things
 * first. So the card's action starts as one button that says what arrives, and
 * pressing it turns that button into the field, in place, with focus already
 * in it. One obvious step either way, and the card never asks WHICH one,
 * because you are standing on it.
 *
 * WHERE THE EXTRA HEIGHT COMES FROM. On a wide screen the three cards share
 * one subgrid, and the 1fr track above the action absorbs whatever this
 * component grows by, so opening a field moves nothing: not the other two
 * cards, not the rules, not the pinned heading above them. Below 1024px the
 * cards are an ordinary stack and the card grows downward, which is what a
 * stacked card is expected to do.
 *
 * HONESTY. /api/waitlist answers `durable`, which is false when the address
 * only reached a server log. When that happens this says so and hands over a
 * mail link that certainly works. It never claims an address was stored.
 *
 * TWO GROUNDS. It was written for the shelf's navy and hardcoded paper-tinted
 * type throughout, which made it invisible the moment a family's own page put
 * it on paper. `tone` swaps the palette and nothing else; every other rule,
 * state and focus target is shared, so the two grounds cannot drift apart.
 */

type Tone = "ink" | "paper";

/** The only thing that differs between the two grounds. */
const PALETTE = {
  ink: {
    body: "text-[color:rgba(214,238,244,0.86)]",
    link: "decoration-[rgba(56,189,248,0.6)] hover:decoration-[var(--accent-sky)]",
    opener: "text-[var(--accent-sky)] outline-[var(--accent-sky)]",
    field:
      "border-[rgba(207,233,238,0.32)] text-[var(--paper)] placeholder:text-[color:rgba(207,233,238,0.4)] hover:border-[rgba(207,233,238,0.55)] focus:border-[var(--accent-sky)]",
    submit:
      "bg-[var(--accent-sky)] text-[var(--ink)] outline-[var(--accent-sky)]",
  },
  paper: {
    body: "text-[color:rgba(11,31,58,0.7)]",
    link: "decoration-[rgba(11,31,58,0.3)] hover:decoration-[var(--ink)]",
    opener: "text-[var(--ink)] outline-[var(--ink)]",
    field:
      "border-[rgba(11,31,58,0.22)] text-[var(--ink)] placeholder:text-[color:rgba(11,31,58,0.38)] hover:border-[rgba(11,31,58,0.4)] focus:border-[var(--ink)]",
    submit: "bg-[var(--ink)] text-[var(--paper)] outline-[var(--ink)]",
  },
} as const satisfies Record<Tone, Record<string, string>>;

type State =
  | { kind: "closed" }
  | { kind: "open" }
  | { kind: "sending" }
  | { kind: "done"; durable: boolean }
  | { kind: "failed" };

export function ShelfSignup({
  id,
  name,
  cta,
  subject,
  tone = "ink",
}: {
  id: ShelfId;
  name: string;
  cta: string;
  subject: string;
  tone?: Tone;
}) {
  const c = PALETTE[tone];
  const fieldId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const frame = useRef(0);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "closed" });

  // Focus has to wait for the swapped element to exist. One frame, cancelled
  // on unmount so nothing calls focus() on a card that has gone.
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const focusNextFrame = (get: () => HTMLElement | null) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => get()?.focus());
  };

  const open = () => {
    setState({ kind: "open" });
    focusNextFrame(() => inputRef.current);
  };

  const close = () => {
    setState({ kind: "closed" });
    focusNextFrame(() => openerRef.current);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "sending") return;
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "superhuman", interest: id }),
      });
      const data = (await res.json()) as { ok?: boolean; durable?: boolean };
      if (!res.ok || !data.ok) throw new Error("rejected");
      setState({ kind: "done", durable: Boolean(data.durable) });
    } catch {
      setState({ kind: "failed" });
    }
  }

  /* Every state renders inside the card's last subgrid row. On a wide
     screen the 1fr track above it takes up the difference, so opening a
     card cannot move the other two or nudge the pinned layout. */

  if (state.kind === "done") {
    return (
      <div data-signup-state="done">
        <p
          role="status"
          className={`max-w-[30ch] text-[0.95rem] leading-[1.55] ${c.body}`}
        >
          {state.durable ? (
            <>On the list. One email when {name.toLowerCase()} opens.</>
          ) : (
            <>
              It reached me, but the list is not built yet. Email{" "}
              <a
                href={mailto(subject)}
                className={`underline underline-offset-4 transition-colors ${c.link}`}
              >
                {EMAIL}
              </a>{" "}
              to be certain.
            </>
          )}
        </p>
      </div>
    );
  }

  if (state.kind === "failed") {
    return (
      <div data-signup-state="failed">
        <p
          role="alert"
          className={`max-w-[30ch] text-[0.95rem] leading-[1.55] ${c.body}`}
        >
          That did not send. Email{" "}
          <a
            href={mailto(subject)}
            className={`underline underline-offset-4 transition-colors ${c.link}`}
          >
            {EMAIL}
          </a>{" "}
          instead.
        </p>
      </div>
    );
  }

  if (state.kind === "closed") {
    return (
      <div data-signup-state="closed">
        <button
          ref={openerRef}
          type="button"
          onClick={open}
          className={`inline-flex items-center gap-1.5 text-[0.95rem] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${c.opener}`}
        >
          {cta}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    );
  }

  const busy = state.kind === "sending";

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
      data-signup-state="open"
      data-signup-for={id}
    >
      {/* Real label, unique id, no visible duplicate: the button you pressed
          to get here already said what the field is for. */}
      <label htmlFor={fieldId} className="sr-only">
        Your email, for {name.toLowerCase()}
      </label>
      <input
        ref={inputRef}
        id={fieldId}
        name="email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="you@somewhere.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={`w-full border-b bg-transparent pb-2 text-[1rem] caret-[var(--accent-sky)] transition-colors duration-300 focus:outline-none ${c.field}`}
      />
      <button
        type="submit"
        disabled={busy}
        className={`mt-4 px-4 py-2.5 text-[0.85rem] transition-[opacity,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-60 ${c.submit}`}
      >
        {busy ? "Sending" : cta}
      </button>
    </form>
  );
}
