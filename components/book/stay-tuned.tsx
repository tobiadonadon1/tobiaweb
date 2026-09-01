"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Sheet } from "@/components/book/sheet";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done"; durable: boolean }
  | { kind: "failed" };

const MAILTO =
  "mailto:tobia@donadon.com?subject=" +
  encodeURIComponent("The book") +
  "&body=" +
  encodeURIComponent("Put me down for a copy of the book.\n");

/**
 * THE ASK, and the end of the page.
 *
 * The heading is one word now: "Pre-order." Tobia cut "before it exists" and
 * then cut the paragraph that used to sit under it ("The book is not written
 * yet. You pay when there is one to pay for. Today it is your name, first in
 * line."). He is right that it was too much text under a one-word heading.
 *
 * But that paragraph was carrying the honesty of the whole page, and a button
 * marked "Pre-order" that quietly takes an address could leave someone
 * believing they bought or reserved a real thing. There is no price, no date,
 * no publisher and no manuscript. So the same facts are now carried three
 * ways, each of them costing almost nothing:
 *
 *   1. THE BUTTON says what actually happens. "Put my name down" cannot be
 *      read as a purchase; "Reserve my copy" could.
 *   2. ONE SHORT LINE under the field, eight words, states the two facts a
 *      reader could otherwise get wrong: nothing is charged, and there is no
 *      finished book. It sits OUTSIDE the form/confirmation switch, so it is
 *      still on screen after a successful submit.
 *   3. THE CONFIRMATION says it again in plain words. Nobody reaches the end
 *      of this interaction without having been told twice.
 *
 * It posts to /api/waitlist, which reports whether the address was genuinely
 * forwarded to a list or only logged, and the confirmation says which. When it
 * was only logged the page says so and hands over the mailto, because a name
 * that quietly went into a server log is not a name on a list.
 */
export function StayTuned() {
  const field = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "sending") return;
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "book", interest: "book" }),
      });
      const data = (await res.json()) as { ok?: boolean; durable?: boolean };
      if (!res.ok || !data.ok) throw new Error("rejected");
      setState({ kind: "done", durable: Boolean(data.durable) });
    } catch {
      setState({ kind: "failed" });
    }
  }

  return (
    <section
      id="stay"
      aria-labelledby="stay-heading"
      className="relative scroll-mt-20 pb-32 pt-20 lg:pb-40 lg:pt-28"
    >
      {/* A pocket of deeper water under the copy. The flare travels right
          through this section, and small type over a moving orange light is
          the one place on the page where contrast could go. This is a
          legibility floor, not decoration: on most frames the water here is
          already dark and you cannot tell it is there. It is what lets the
          flare stay rich instead of being dimmed for the whole page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(72% 60% at 50% 40%, rgba(3,8,18,0.78) 0%, rgba(3,8,18,0.56) 38%, rgba(3,8,18,0.2) 70%, rgba(3,8,18,0) 100%)",
        }}
      />

      <Sheet className="relative z-10">
        <div className="mx-auto max-w-[34rem] text-center">
          <h2
            id="stay-heading"
            className="font-serif text-[clamp(1.9rem,4.4vw,2.8rem)] leading-[1.1] tracking-[-0.02em] text-paper"
          >
            Pre-order.
          </h2>

          <div className="mt-10">
            {state.kind === "done" ? (
              <p
                role="status"
                aria-live="polite"
                className="text-[1.05rem] leading-[1.7] text-paper/85"
              >
                {state.durable ? (
                  "Your name is down. Nothing was charged. I write to you when the book is finished."
                ) : (
                  <>
                    It reached me, but the list is not wired up yet. Send{" "}
                    <a
                      href={MAILTO}
                      className="text-paper underline decoration-paper/40 underline-offset-4 transition-colors duration-300 hover:decoration-paper"
                    >
                      one line to tobia@donadon.com
                    </a>{" "}
                    and I will put you down by hand.
                  </>
                )}
              </p>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mx-auto flex max-w-[26rem] flex-col gap-4 sm:flex-row sm:items-center"
              >
                <label htmlFor="book-email" className="sr-only">
                  Your email address
                </label>
                <input
                  ref={field}
                  id="book-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@somewhere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full flex-1 border-b border-paper/25 bg-transparent pb-3 text-[1.05rem] text-paper caret-[#f0743a] transition-colors duration-300 placeholder:text-paper/70 hover:border-paper/45 focus:border-[#f0743a] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={state.kind === "sending"}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.95rem] text-paper transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0743a] disabled:opacity-60"
                  // The one place the orange goes solid instead of staying
                  // light. It is the same hue as the flare in the water
                  // behind it, one step hotter so it separates.
                  style={{
                    background:
                      "linear-gradient(165deg, #f57c36 0%, #dd552b 52%, #ce4631 100%)",
                  }}
                >
                  {state.kind === "sending" ? "Sending" : "Put my name down"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </form>
            )}

            {/* The honesty, in eight words, under the field where price
                microcopy belongs. Outside the switch above on purpose: it is
                still there after the form has been replaced.
                "No money changes hands" and not "nothing to pay", which a
                reader could take as a promise the book will be free, and not
                "nothing to pay yet", which implies they will owe something.
                This describes the one thing that is actually happening. */}
            <p className="mt-6 text-[0.9rem] leading-[1.6] text-paper/80">
              No money changes hands. The book is unfinished.
            </p>

            {state.kind === "failed" ? (
              <p role="alert" className="mt-5 text-[0.95rem] text-paper/70">
                That did not go through.{" "}
                <a
                  href={MAILTO}
                  className="underline decoration-paper/40 underline-offset-4"
                >
                  Write to me
                </a>{" "}
                and I will put you down by hand.
              </p>
            ) : null}
          </div>
        </div>
      </Sheet>
    </section>
  );
}
