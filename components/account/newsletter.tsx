"use client";

import { useId, useSyncExternalStore } from "react";
import "./newsletter.css";

/**
 * THE NEWSLETTER BOX, and the bot that asks for it.
 *
 * One box, the same words everywhere it appears (Create account, Sign in, and
 * under every free claim button): never ticked for anyone, never required.
 * A tick travels with whatever the visitor was doing and lands in
 * lib/newsletter.ts.
 *
 * Once this device has seen a yes, the box stops appearing for anonymous
 * visitors (a localStorage flag; a signed-in member's own flag comes from
 * /api/account/me instead). Storage can be blocked: then it simply asks again.
 */

export const NEWSLETTER_TEXT = "Get my latest free skills, experiments and projects by email. Unsubscribe anytime.";
const KEY = "tw-newsletter";

export function rememberSubscribed() {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // Blocked storage: the box just shows again next time.
  }
}

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
function listen(changed: () => void) {
  window.addEventListener("storage", changed);
  return () => window.removeEventListener("storage", changed);
}

/** Whether this device already said yes. `undefined` until hydrated (the server can't know). */
export function useKnownSubscribed(): boolean | undefined {
  return useSyncExternalStore<boolean | undefined>(listen, read, () => undefined);
}

/** The box. Colours come from the surface it sits on: its soft text, its accent for the tick. */
export function NewsletterBox({
  checked,
  onChange,
  soft,
  accent,
  mark,
  line,
  fill,
  center = false,
  hidden = false,
  nudge = false,
  fine = false,
  className = "",
}: {
  checked: boolean;
  onChange: (on: boolean) => void;
  /** Text colour class for the words. */
  soft: string;
  /** CSS colours: the filled box, the tick on it, the empty box's outline. */
  accent: string;
  mark: string;
  line: string;
  /** The empty box's fill, where an outline alone gets lost (Motion Designer's orange). */
  fill?: string;
  center?: boolean;
  /** Keep its space but don't show it yet (while the page asks who this is). */
  hidden?: boolean;
  /** The sign-in bot is pointing at it. */
  nudge?: boolean;
  /** Very small fine print: a smaller box and text (Duo Designer). */
  fine?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div
      className={`nl-row ${hidden ? "invisible" : ""} ${className}`}
      data-center={center || undefined}
      data-nudge={nudge || undefined}
      data-fine={fine || undefined}
      aria-hidden={hidden || undefined}
      style={{ "--nl-accent": accent, "--nl-mark": mark, "--nl-line": line, "--nl-fill": fill } as React.CSSProperties}
    >
      <input
        id={id}
        type="checkbox"
        className="nl-box"
        checked={checked}
        tabIndex={hidden ? -1 : undefined}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id} className={`nl-text ${soft}`}>
        {NEWSLETTER_TEXT}
      </label>
    </div>
  );
}

/**
 * The sign-in nudge: a small black bot (Viral Machine's sleeping bot, awake)
 * pops up over the box with a wiggle and asks once. Ticking makes it happy.
 * Reduced motion: it just appears.
 */
export function NewsletterBot({ happy }: { happy: boolean }) {
  return (
    <div className="nl-bot-row" role="status">
      <span className="nl-bot" data-happy={happy || undefined} aria-hidden>
        {[0, 1].map((i) => (
          <span key={i} className="nl-eye" />
        ))}
      </span>
      <span className="nl-bubble">{happy ? "Yay. See you in your inbox." : "Psst… tick me? New free skills, first."}</span>
    </div>
  );
}
