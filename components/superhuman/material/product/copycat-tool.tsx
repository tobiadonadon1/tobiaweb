"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Check, Copy, Download, LoaderCircle, Plus, RotateCcw, X as Close } from "lucide-react";
import { ACCOUNT_HREF } from "@/components/account/links";
import { useMember } from "@/components/account/use-member";

/**
 * COPYCAT DETECTIVE, ON THE PAGE.
 *
 * One field and one button. The first time someone presses Check while
 * signed out, they go to create an account (or sign in) and come straight
 * back with their link still filled in, and the check starts by itself. From
 * then on it just runs. The check streams its steps (app/api/copycat/check),
 * then the verdict, the receipt and a one-tap post replace the example.
 */

type Side = { who: string; url: string; when: string | null; avatar: string | null; linkHandle: string | null };
type Result = {
  verdict: string;
  headline: string;
  why: string;
  gap: string | null;
  earlier: Side;
  later: Side;
  matches: string[];
  receipt: string | null;
  post: string | null;
  intent: string | null;
};
type NeedsOriginal = { who: string; when: string | null; text: string; url: string; quotes: number | null; linkHandle: string | null };

const STEPS: [string, string][] = [
  ["read", "Reading the link"],
  ["original", "Finding the original"],
  ["credit", "Checking for credit"],
  ["media", "Getting the pictures"],
  ["compare", "Comparing them"],
  ["judge", "Looking closely"],
  ["receipt", "Drawing the receipt"],
];

const STAMP: Record<string, { word: string; tone: string }> = {
  uncredited: { word: "No credit", tone: "red" },
  reupload: { word: "Same picture", tone: "red" },
  credited: { word: "Credited", tone: "green" },
  similar: { word: "Just similar", tone: "ink" },
  "too-close": { word: "Too close to call", tone: "ink" },
  "wrong-way": { word: "Wrong way round", tone: "ink" },
  "same-account": { word: "Same account", tone: "ink" },
  unknown: { word: "Not enough to go on", tone: "ink" },
};

const ERRORS: Record<string, string> = {
  limit: "That's today's checks used up. Come back tomorrow.",
  busy: "A lot of people are checking right now. Try again in a little while.",
  judge: "The checker is resting for a moment. Try again in a few minutes.",
  "bad-link": "That doesn't look like a link. Paste one that starts with https://",
  failed: "Something went wrong reading that link. Try again, or try another link.",
  network: "The connection dropped. Try again.",
};

const field =
  "min-w-0 flex-1 rounded-full bg-transparent px-5 py-3.5 text-[1.05rem] text-[#121212] outline-none placeholder:text-[#8a8579]";

export function CopycatTool({ example }: { example: React.ReactNode }) {
  const member = useMember();
  const pathname = usePathname();
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [two, setTwo] = useState(false);
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [needs, setNeeds] = useState<NeedsOriginal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"" | "image" | "text">("");
  const secondInput = useRef<HTMLInputElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const run = useCallback(async (links: string[]) => {
    setState("running");
    setStep([]);
    setResult(null);
    setNeeds(null);
    setError(null);
    setCopied("");
    try {
      const res = await fetch("/api/copycat/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ links }),
      });
      if (!res.ok || !res.body) {
        const b = (await res.json().catch(() => ({}))) as { error?: string };
        if (b.error === "sign-in") { window.location.href = signInHref(links); return; }
        setError(ERRORS[b.error ?? "failed"] ?? ERRORS.failed);
        setState("done");
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          const msg = JSON.parse(line);
          if (msg.step) setStep((s) => [...s, msg.step]);
          if (msg.done) {
            if (msg.error) setError(msg.message || ERRORS[msg.error] || ERRORS.failed);
            else if (msg.needsOriginal) {
              setNeeds(msg.needsOriginal);
              setTwo(true);
              requestAnimationFrame(() => secondInput.current?.focus());
            } else setResult(msg as Result);
            setState("done");
          }
        }
      }
    } catch {
      setError(ERRORS.network);
      setState("done");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Where a signed-out visitor goes, carrying their links back with them. */
  const signInHref = (links: string[]) => {
    const q = new URLSearchParams();
    if (links[0]) q.set("l1", links[0]);
    if (links[1]) q.set("l2", links[1]);
    return `${ACCOUNT_HREF}?mode=signup&next=${encodeURIComponent(`${pathname}?${q}#check`)}`;
  };

  // Back from signing in: put the links back and start.
  useEffect(() => {
    if (started.current || member === undefined) return;
    const q = new URLSearchParams(window.location.search);
    const l1 = q.get("l1"), l2 = q.get("l2");
    if (!l1) return;
    started.current = true;
    window.history.replaceState(null, "", `${pathname}#check`);
    // After this render: fill the fields back in, and go.
    requestAnimationFrame(() => {
      setFirst(l1);
      if (l2) { setSecond(l2); setTwo(true); }
      if (member) run([l1, l2].filter(Boolean) as string[]);
    });
  }, [member, pathname, run]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "running") return;
    const links = [first.trim(), two ? second.trim() : ""].filter(Boolean);
    if (!links.length) return;
    // Known to be signed out: straight to the account. Still asking: try, and the server says.
    if (member === null) { window.location.href = signInHref(links); return; }
    run(links);
  };

  const reset = () => {
    setState("idle");
    setResult(null);
    setNeeds(null);
    setError(null);
    setFirst("");
    setSecond("");
    setTwo(false);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyImage = async () => {
    if (!result?.receipt) return;
    try {
      const blob = fetch(result.receipt).then((r) => r.blob());
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied("image");
    } catch {
      setCopied("");
    }
  };
  const copyText = async () => {
    if (!result?.post) return;
    try { await navigator.clipboard.writeText(result.post); setCopied("text"); } catch {}
  };

  const stamp = result ? STAMP[result.verdict] ?? STAMP.unknown : null;

  return (
    <div ref={top} id="check" className="w-full scroll-mt-28">
      {/* The field. */}
      <form onSubmit={submit} className="mx-auto w-full max-w-[44rem]">
        <div className="flex items-center gap-1.5 rounded-full border border-[#d4cfc2] bg-white p-1.5 shadow-[0_1px_0_rgba(18,18,18,0.04),0_18px_40px_-24px_rgba(40,30,10,0.45)] focus-within:border-[#121212]">
          <label htmlFor="cd-first" className="sr-only">The link you think copied</label>
          <input
            id="cd-first"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            required
            placeholder={two ? "The one you think copied" : "Paste a link"}
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            className={field}
          />
          <button
            type="submit"
            disabled={state === "running"}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#121212] px-6 py-3.5 text-[1.02rem] font-semibold text-[#f3f0e8] transition-transform duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121212]"
          >
            {state === "running" ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : null}
            {state === "running" ? "Checking" : "Check"}
            {state === "running" ? null : <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
          </button>
        </div>

        {two ? (
          <div className="mt-3 flex items-center gap-1.5 rounded-full border border-[#d4cfc2] bg-white p-1.5 focus-within:border-[#121212]">
            <label htmlFor="cd-second" className="sr-only">The original</label>
            <input
              ref={secondInput}
              id="cd-second"
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="The original (optional: it's usually found for you)"
              value={second}
              onChange={(e) => setSecond(e.target.value)}
              className={field}
            />
            <button type="button" onClick={() => { setTwo(false); setSecond(""); }} aria-label="Remove the second link" className="mr-2 rounded-full p-2 text-[#6a665c] hover:bg-[#f3f0e8]">
              <Close aria-hidden className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.9rem] text-[#6a665c]">
          {two ? null : (
            <button type="button" onClick={() => { setTwo(true); requestAnimationFrame(() => secondInput.current?.focus()); }} className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-[#121212] hover:underline">
              <Plus aria-hidden className="h-3.5 w-3.5" />
              Add the original&rsquo;s link
            </button>
          )}
          <span>
            {member ? <>Signed in as <span className="text-[#121212]">{member.email}</span></> : "Free. Sign in once, then use it any time."}
          </span>
        </div>
      </form>

      {/* What happens. */}
      <div className="mx-auto mt-12 w-full max-w-[72rem] md:mt-16" aria-live="polite">
        {state === "running" ? (
          <div className="mx-auto max-w-[30rem] rounded-[22px] bg-white p-7 shadow-[0_0_0_1px_rgba(18,18,18,0.07),0_24px_48px_-30px_rgba(40,30,10,0.4)]">
            <p className="font-[family-name:var(--cd-mono)] text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#6a665c]">Checking · about a minute</p>
            <ol className="mt-5 flex list-none flex-col gap-3 p-0">
              {STEPS.filter(([id]) => step.includes(id) || (id !== "original" && id !== "receipt")).map(([id, label]) => {
                const done = step.includes(id) && step[step.length - 1] !== id;
                const now = step[step.length - 1] === id;
                return (
                  <li key={id} className={`flex items-center gap-3 text-[1.02rem] ${done || now ? "text-[#121212]" : "text-[#a9a496]"}`}>
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${done ? "bg-[#13824a] text-white" : now ? "text-[#121212]" : "border border-[#d4cfc2]"}`}>
                      {done ? <Check aria-hidden className="h-3.5 w-3.5" /> : now ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : null}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : state === "done" && error ? (
          <div role="alert" className="mx-auto max-w-[34rem] rounded-[22px] bg-white p-7 text-center shadow-[0_0_0_1px_rgba(18,18,18,0.07)]">
            <p className="text-[1.1rem] leading-[1.5] text-[#121212]">{error}</p>
            <button type="button" onClick={() => setState("idle")} className="mt-4 text-[0.95rem] text-[#6a665c] underline underline-offset-4 hover:text-[#121212]">Back</button>
          </div>
        ) : state === "done" && needs ? (
          <div className="mx-auto max-w-[34rem] rounded-[22px] bg-white p-7 shadow-[0_0_0_1px_rgba(18,18,18,0.07)]">
            <p className="text-[1.15rem] font-semibold">This one doesn&rsquo;t point to an earlier post.</p>
            <p className="mt-2 text-[1rem] leading-[1.55] text-[#3d3a33]">
              {needs.who}{needs.when ? `, ${needs.when}` : ""}. Paste the original&rsquo;s link in the second box and press Check.
              {needs.quotes ? ` If this is the original, copies are often among the ${needs.quotes} posts that quote it.` : ""}
            </p>
            {needs.linkHandle ? <p className="mt-2 text-[0.92rem] text-[#6a665c]">Note: the link says @{needs.linkHandle}, but X shows this post as {needs.who}&rsquo;s.</p> : null}
          </div>
        ) : state === "done" && result && stamp ? (
          <div className="flex flex-col items-center">
            {/* The verdict, in one line and a stamp. */}
            <div className="flex flex-col items-center text-center">
              <span className={`cd-stamp cd-stamp--${stamp.tone} cd-stamp--still cd-stamp--big`} style={{ "--r": "-3deg" } as React.CSSProperties}>{stamp.word}</span>
              <p className="mt-6 max-w-[40ch] text-pretty text-[1.15rem] leading-[1.5] text-[#3d3a33] md:text-[1.2rem]">{result.why}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 font-[family-name:var(--cd-mono)] text-[0.85rem] text-[#6a665c]">
                <span><b className="text-[#121212]">First</b> {result.earlier.who}{result.earlier.when ? ` · ${result.earlier.when}` : ""}</span>
                <span><b className="text-[#121212]">Later</b> {result.later.who}{result.later.when ? ` · ${result.later.when}` : ""}</span>
                {result.gap ? <span><b className="text-[#121212]">Gap</b> {result.gap.replace(/ later$/, "")}</span> : null}
              </div>
              {[result.earlier, result.later].filter((s) => s.linkHandle).map((s) => (
                <p key={s.url} className="mt-2 text-[0.88rem] text-[#6a665c]">The link said @{s.linkHandle}; X shows the post as {s.who}&rsquo;s.</p>
              ))}
            </div>

            {result.receipt ? (
              <>
                <div className="mt-10 w-full overflow-hidden rounded-[clamp(10px,1.4vw,18px)] shadow-[0_0_0_1px_rgba(18,18,18,0.08),0_40px_80px_-40px_rgba(40,30,10,0.45)]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- a generated PNG, already full size */}
                  <img src={result.receipt} alt={`The receipt: ${result.earlier.who} first, ${result.later.who} ${result.gap ?? ""}. ${stamp.word}. ${result.matches.join(". ")}.`} className="block h-auto w-full" />
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {result.intent ? (
                    <a href={result.intent} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-[#121212] px-6 py-3 text-[1rem] font-semibold text-[#f3f0e8] transition-transform duration-200 hover:scale-[1.03] active:scale-95">
                      Post on X
                      <ArrowRight aria-hidden className="h-4 w-4" />
                    </a>
                  ) : null}
                  <button type="button" onClick={copyImage} className="inline-flex items-center gap-2 rounded-full border border-[#d4cfc2] bg-white px-5 py-3 text-[0.98rem] text-[#121212] hover:border-[#121212]">
                    {copied === "image" ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
                    {copied === "image" ? "Copied" : "Copy image"}
                  </button>
                  <a href={result.receipt} download="receipt.png" className="inline-flex items-center gap-2 rounded-full border border-[#d4cfc2] bg-white px-5 py-3 text-[0.98rem] text-[#121212] hover:border-[#121212]">
                    <Download aria-hidden className="h-4 w-4" />
                    Download
                  </a>
                </div>
                {result.post ? (
                  <div className="mt-6 w-full max-w-[34rem] rounded-[18px] bg-white p-5 shadow-[0_0_0_1px_rgba(18,18,18,0.07)]">
                    <div className="flex items-center justify-between">
                      <p className="font-[family-name:var(--cd-mono)] text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-[#6a665c]">The post</p>
                      <button type="button" onClick={copyText} className="inline-flex items-center gap-1.5 text-[0.85rem] text-[#6a665c] hover:text-[#121212]">
                        {copied === "text" ? <Check aria-hidden className="h-3.5 w-3.5" /> : <Copy aria-hidden className="h-3.5 w-3.5" />}
                        {copied === "text" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="mt-3 whitespace-pre-line break-words text-[1rem] leading-[1.5] text-[#121212]">{result.post}</p>
                    <p className="mt-3 text-[0.85rem] text-[#6a665c]">Copy the image, press Post on X, paste it in. Nothing goes out until you post it.</p>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mt-6 max-w-[40ch] text-center text-[0.95rem] text-[#6a665c]">No receipt for this one: there&rsquo;s nothing that would be fair to post.</p>
            )}
            <button type="button" onClick={reset} className="mt-8 inline-flex items-center gap-2 text-[0.95rem] text-[#6a665c] underline-offset-4 hover:text-[#121212] hover:underline">
              <RotateCcw aria-hidden className="h-4 w-4" />
              Check another
            </button>
          </div>
        ) : (
          example
        )}
      </div>
    </div>
  );
}
