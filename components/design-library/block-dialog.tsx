"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { ArrowRight, Box, Check, ChevronLeft, ChevronRight, Code2, Copy, Download, Link2, Lock, Sparkles, X } from "lucide-react";
import { JOIN_HREF } from "@/components/account/links";
import { accountHref, canCopy, downloadFile, type Access } from "./access";
import type { Block, Control } from "./catalog.generated";
import { highlight } from "./highlight";
import { groundOf, Stage } from "./stage";

/**
 * ONE BLOCK, UP CLOSE: the block on a big stage (or its code), and beside it
 * what it is, its knobs, and the ways to take it: copy the code, download
 * the file, or copy a prompt that has Claude put it in your project. What
 * the knobs are set to travels with it: the usage line under them, and the
 * prompt, use the visitor's own settings.
 *
 * The code is fetched when it's asked for, from /api/design/source, which
 * answers only a plan that opens it. Everyone else sees the few lines of
 * "how it works" the block chose to show, and the one way in.
 */

type Source = { state: "idle" | "loading" | "ok" | "signed-out" | "plan" | "failed"; text?: string };
const sources = new Map<string, string>();

/** The block's source from the server (kept for the rest of the visit), or why not. */
async function requestSource(slug: string): Promise<Source> {
  try {
    const res = await fetch(`/api/design/source?slug=${slug}`, { cache: "no-store" });
    const body = (await res.json()) as { ok: boolean; source?: string };
    if (body.ok && body.source) {
      sources.set(slug, body.source);
      return { state: "ok", text: body.source };
    }
    return { state: res.status === 401 ? "signed-out" : res.status === 403 ? "plan" : "failed" };
  } catch {
    return { state: "failed" };
  }
}

export function BlockDialog({
  block,
  access,
  onClose,
  onStep,
}: {
  block: Block | null;
  access: Access;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const isOpen = Boolean(block);

  // The page behind stays put while a block is open.
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, [isOpen]);

  // Esc closes (unless the block used Esc itself), and Tab stays inside.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) {
        e.preventDefault();
        onClose();
        return;
      }
      const box = panel.current;
      if (e.key !== "Tab" || !box) return;
      const stops = [...box.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => el.getClientRects().length > 0,
      );
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (!box.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!block || typeof document === "undefined") return null;
  // At the root of the page (a portal), so no stacking context on the way
  // can put the nav above it. Not a <dialog>: a modal one lives in the browser's top layer, above the
  // site's own cursor (components/ui/custom-cursor.tsx, z-100), and the real
  // cursor is hidden site-wide, so inside it you'd have no pointer at all.
  // This sits at z-90: over the page and the nav, under the cursor.
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={block.title} className="fixed inset-0 z-[90] flex items-center justify-center text-[#141414]">
      <div aria-hidden className="absolute inset-0 bg-[rgba(255,255,255,0.8)] backdrop-blur-[10px]" onClick={onClose} />
      <div ref={panel} className="relative h-[min(46rem,calc(100svh-2rem))] w-[min(76rem,calc(100vw-2rem))] max-md:h-[100svh] max-md:w-screen">
        <Detail key={block.slug} block={block} access={access} onClose={onClose} onStep={onStep} />
      </div>
    </div>,
    document.body,
  );
}

function Detail({ block: b, access, onClose, onStep }: { block: Block; access: Access; onClose: () => void; onStep: (dir: 1 | -1) => void }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [props, setProps] = useState<Record<string, unknown>>({});
  const [source, setSource] = useState<Source>(() => {
    const hit = sources.get(b.slug);
    return hit ? { state: "ok", text: hit } : { state: "idle" };
  });
  const allowed = canCopy(access, b);

  // A click that needs the code (Copy, Try again).
  const load = async (): Promise<string | null> => {
    const hit = sources.get(b.slug);
    if (hit) return hit;
    setSource({ state: "loading" });
    const got = await requestSource(b.slug);
    setSource(got);
    return got.text ?? null;
  };
  // Members get the code fetched as soon as the block opens, so Copy is instant.
  useEffect(() => {
    if (!allowed || sources.has(b.slug)) return;
    let live = true;
    void requestSource(b.slug).then((got) => live && setSource(got));
    return () => {
      live = false;
    };
  }, [allowed, b.slug]);

  // ← → move between blocks, unless a control or the block has the keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.closest("[data-block-stage], [role=radiogroup], [role=tablist]") || /INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.getAttribute("role") === "slider")) return;
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onStep]);

  const usage = usageOf(b, props);
  const ground = groundOf(b);
  return (
    <div tabIndex={-1} autoFocus className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-3 outline-none max-md:gap-0 md:grid-cols-[minmax(0,1fr)_22rem] md:grid-rows-1">
      {/* The stage: the block, or its code. */}
      <section
        className="relative min-h-[17rem] overflow-hidden rounded-[28px] max-md:rounded-none"
        style={{ background: tab === "preview" ? ground : "#fafafa", color: b.dark && tab === "preview" ? "#f4f4f2" : "#141414" }}
      >
        <div className="absolute left-3 top-3 z-10 flex rounded-full bg-[rgba(20,20,20,0.07)] p-1 backdrop-blur" role="tablist" aria-label="Show">
          {(
            [
              ["preview", "Preview", Box],
              ["code", "Code", Code2],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") setTab(tab === "preview" ? "code" : "preview");
              }}
              className={`flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.88rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#141414] ${
                tab === id ? "bg-white text-[#141414] shadow-[0_1px_2px_rgba(20,20,20,0.12)]" : b.dark && tab === "preview" ? "text-white/75" : "text-[color:rgba(20,20,20,0.65)]"
              }`}
            >
              <Icon aria-hidden className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
        {/* On a phone the panel's close is far away: one here too. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full md:hidden ${b.dark && tab === "preview" ? "bg-white/12 text-white" : "bg-white/85 text-[#141414] shadow-[0_1px_2px_rgba(20,20,20,0.1)]"}`}
        >
          <X aria-hidden className="h-5 w-5" />
        </button>
        {tab === "preview" ? (
          <div data-block-stage className="absolute inset-0">
            <Stage width={560} height={460} minWidth={360} minHeight={300}>
              <b.Component {...props} />
            </Stage>
          </div>
        ) : (
          <CodePane block={b} allowed={allowed} source={source} onLoad={load} />
        )}
      </section>

      {/* What it is, its knobs, and the ways to take it. The head and the
          buttons stay put while the middle scrolls, so on a phone the way
          out and the way in are always on screen. */}
      <aside className="flex min-h-0 flex-col overflow-y-auto overscroll-contain rounded-[28px] border border-[rgba(20,20,20,0.08)] bg-white max-md:max-h-[54svh] max-md:rounded-none max-md:border-x-0 max-md:border-b-0">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 pb-1 pt-4 max-md:px-5">
          <span className="text-[0.85rem] text-[color:rgba(20,20,20,0.5)]">
            {b.category} · {b.lines} lines{b.free ? " · Free" : ""}
          </span>
          <div className="-mr-2 flex items-center gap-0.5">
            <IconButton label="Previous block" onClick={() => onStep(-1)}>
              <ChevronLeft aria-hidden className="h-4 w-4" />
            </IconButton>
            <IconButton label="Next block" onClick={() => onStep(1)}>
              <ChevronRight aria-hidden className="h-4 w-4" />
            </IconButton>
            <IconButton label="Copy a link to this block" onClick={() => void navigator.clipboard.writeText(window.location.href).catch(() => {})}>
              <Link2 aria-hidden className="h-4 w-4" />
            </IconButton>
            <span className="max-md:hidden">
              <IconButton label="Close" onClick={onClose}>
                <X aria-hidden className="h-4 w-4" />
              </IconButton>
            </span>
          </div>
        </div>
        <div className="px-6 max-md:px-5">
          <h2 className="mt-1 text-[1.6rem] font-medium leading-[1.1] tracking-[-0.02em]">{b.title}</h2>
          <p className="mt-3 text-pretty text-[0.98rem] leading-[1.55] text-[color:rgba(20,20,20,0.75)]">{b.description}</p>

          {b.controls.length ? (
            <div className="mt-6 grid gap-3">
              {b.controls.map((c) => (
                <ControlRow
                  key={c.prop}
                  control={c}
                  value={props[c.prop]}
                  onChange={(v) => {
                    setProps((p) => ({ ...p, [c.prop]: v }));
                    setTab("preview");
                  }}
                />
              ))}
            </div>
          ) : null}
          {allowed && Object.keys(props).length ? (
            <pre className="mt-4 overflow-x-auto rounded-xl bg-[#fafafa] px-3.5 py-3 font-mono text-[0.78rem] leading-[1.6]" aria-label="Use it with these settings">
              <code>{highlight(usage)}</code>
            </pre>
          ) : null}
        </div>

        <div className="sticky bottom-0 mt-auto bg-white px-6 pb-6 pt-5 shadow-[0_-14px_14px_-10px_rgba(255,255,255,1)] max-md:px-5 max-md:pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Take block={b} access={access} allowed={allowed} source={source} onLoad={load} usage={usage} tuned={Object.keys(props).length > 0} />
        </div>
      </aside>
    </div>
  );
}

/** `<SwipeDeck palette="night" threshold={140} />`: the block as the visitor set it. */
function usageOf(b: Block, props: Record<string, unknown>) {
  const attrs = Object.entries(props).map(([k, v]) => (typeof v === "string" ? `${k}="${v}"` : `${k}={${JSON.stringify(v)}}`));
  return `<${b.component}${attrs.length ? " " + attrs.join(" ") : ""} />`;
}

/* ------------------------------------------------------------ code */

function CodePane({ block: b, allowed, source, onLoad }: { block: Block; allowed: boolean; source: Source; onLoad: () => Promise<string | null> }) {
  if (allowed && source.state === "ok" && source.text) return <Code text={source.text} name={`${b.slug}.tsx`} />;
  if (allowed && (source.state === "idle" || source.state === "loading"))
    return <p className="absolute inset-0 grid place-items-center text-[0.95rem] text-[color:rgba(20,20,20,0.55)]">Opening the code…</p>;

  // Not open to this visitor (or it didn't load): the trick at its heart, and the
  // reason the rest is locked. The way in is the panel's button, said once.
  return (
    <div className="absolute inset-0 overflow-y-auto overscroll-contain px-5 pb-6 pt-16 md:px-7">
      {allowed && source.state === "failed" ? (
        <p className="text-[0.95rem] text-[var(--accent-clay-text)]">
          {"The code didn't load. "}
          <button type="button" onClick={() => void onLoad()} className="underline underline-offset-4">
            Try again
          </button>
        </p>
      ) : (
        <div className="max-w-[34rem]">
          <p className="flex items-center gap-2 text-[1.02rem] font-medium">
            <Lock aria-hidden className="h-4 w-4" />
            {b.free ? "Free with an account" : "The code comes with Pro"}
          </p>

        </div>
      )}
      {b.howItWorks ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[rgba(20,20,20,0.08)] bg-white">
          <p className="border-b border-[rgba(20,20,20,0.08)] px-4 py-3 text-[0.88rem] font-medium">How it works</p>
          <pre className="overflow-x-auto p-4 font-mono text-[0.82rem] leading-[1.65]">
            <code>{highlight(b.howItWorks)}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function Code({ text, name }: { text: string; name: string }) {
  const lines = text.replace(/\n$/, "").split("\n").length;
  return (
    <div className="absolute inset-0 overflow-auto overscroll-contain pt-14">
      <p className="absolute right-4 top-4 font-mono text-[0.8rem] text-[color:rgba(20,20,20,0.5)] max-md:right-16">{name}</p>
      <div className="flex min-w-max font-mono text-[0.82rem] leading-[1.7]">
        <pre aria-hidden className="sticky left-0 select-none bg-[#fafafa] py-4 pl-5 pr-4 text-right text-[color:rgba(20,20,20,0.3)]">
          {Array.from({ length: lines }, (_, i) => i + 1).join("\n")}
        </pre>
        <pre className="py-4 pr-8">
          <code>{highlight(text.replace(/\n$/, ""))}</code>
        </pre>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- controls */

function ControlRow({ control: c, value, onChange }: { control: Control; value: unknown; onChange: (v: unknown) => void }) {
  if (c.type === "range") {
    const v = typeof value === "number" ? value : (c.default ?? Math.round((c.min + c.max) / 2 / c.step) * c.step);
    const pct = ((v - c.min) / (c.max - c.min)) * 100;
    return (
      <label className="relative flex h-11 items-center justify-between overflow-hidden rounded-xl bg-[rgba(20,20,20,0.05)] px-3.5 text-[0.92rem] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#141414]">
        <span aria-hidden className="absolute inset-y-0 left-0 bg-[rgba(20,20,20,0.08)]" style={{ width: `${pct}%` }} />
        <span className="relative">{c.label}</span>
        <span className="relative tabular-nums text-[color:rgba(20,20,20,0.6)]">
          {v}
          {c.unit ? ` ${c.unit}` : ""}
        </span>
        <input
          type="range"
          min={c.min}
          max={c.max}
          step={c.step}
          value={v}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          aria-label={c.label}
        />
      </label>
    );
  }
  const current = value ?? c.default ?? c.options[0][1];
  const index = Math.max(0, c.options.findIndex(([, v]) => v === current));
  // A radio group: one tab stop, arrows move the choice (and don't change blocks).
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + c.options.length) % c.options.length;
    onChange(c.options[next][1]);
    (e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")[next] ?? null)?.focus();
  };
  return (
    <div className="flex min-h-11 items-center justify-between gap-3 text-[0.92rem]">
      <span>{c.label}</span>
      <div
        role="radiogroup"
        aria-label={c.label}
        onKeyDown={onKey}
        className={c.type === "swatch" ? "flex gap-2" : "flex flex-wrap justify-end rounded-full bg-[rgba(20,20,20,0.05)] p-1"}
      >
        {c.options.map(([label, v], i) => {
          const on = i === index;
          return c.type === "swatch" ? (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              aria-label={label}
              title={label}
              onClick={() => onChange(v)}
              className={`h-8 w-8 rounded-full ring-offset-2 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414] ${on ? "ring-2 ring-[#141414]" : "ring-1 ring-[rgba(20,20,20,0.12)]"}`}
              style={{ background: String(v) }}
            />
          ) : (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(v)}
              className={`h-8 rounded-full px-3 text-[0.85rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#141414] ${on ? "bg-white shadow-[0_1px_2px_rgba(20,20,20,0.12)]" : "text-[color:rgba(20,20,20,0.6)]"}`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- take it */

const BIG =
  "group flex h-12 w-full items-center justify-center gap-2 rounded-full text-[0.98rem] font-medium transition-[transform,background-color] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] disabled:opacity-60";
const SOLID = `${BIG} bg-[#141414] text-[#fff] hover:bg-[#2c2c2c]`;
const SOFT = `${BIG} border border-[rgba(20,20,20,0.16)] bg-white hover:bg-[rgba(20,20,20,0.03)]`;

function Take({
  block: b,
  access,
  allowed,
  source,
  onLoad,
  usage,
  tuned,
}: {
  block: Block;
  access: Access;
  allowed: boolean;
  source: Source;
  onLoad: () => Promise<string | null>;
  usage: string;
  tuned: boolean;
}) {
  const [done, setDone] = useState<"" | "code" | "prompt" | "file">("");
  const [fileFailed, setFileFailed] = useState(false);
  const flash = (what: typeof done) => {
    setDone(what);
    setTimeout(() => setDone((d) => (d === what ? "" : d)), 1600);
  };
  const copy = async (what: "code" | "prompt") => {
    const text = source.text ?? (await onLoad());
    if (!text) return;
    await navigator.clipboard.writeText(what === "code" ? text : prompt(b, text, tuned ? usage : null)).catch(() => {});
    flash(what);
  };

  if (access === "loading") return <div className="h-[7.5rem]" aria-hidden />;
  if (!allowed)
    return (
      <WayIn block={b} access={access} />
    );

  const busy = source.state === "loading";
  return (
    <div className="grid gap-2.5">
      <button type="button" onClick={() => void copy("prompt")} disabled={busy} className={SOLID}>
        {done === "prompt" ? <Check aria-hidden className="h-4 w-4" /> : <Sparkles aria-hidden className="h-4 w-4" />}
        {done === "prompt" ? "Copied: paste it into Claude" : "Copy prompt for Claude"}
      </button>
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={() => void copy("code")} disabled={busy} className={SOFT}>
          {done === "code" ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
          {done === "code" ? "Copied" : "Copy code"}
        </button>
        <button
          type="button"
          onClick={async () => {
            const ok = await downloadFile(`/api/design/source?slug=${b.slug}&download=1`, `${b.slug}.tsx`, b.slug);
            setFileFailed(!ok);
            if (ok) flash("file");
          }}
          className={SOFT}
        >
          {done === "file" ? <Check aria-hidden className="h-4 w-4" /> : <Download aria-hidden className="h-4 w-4" />}
          .tsx
        </button>
      </div>
      {source.state === "signed-out" ? (
        <p className="text-[0.88rem] text-[var(--accent-clay-text)]">
          {"You've been signed out. "}
          <Link href={accountHref("signin", b.slug)} className="underline underline-offset-4">
            Sign in again
          </Link>
        </p>
      ) : source.state === "plan" ? (
        <p className="text-[0.88rem] text-[var(--accent-clay-text)]">
          {"Your plan doesn't include this one. "}
          <Link href={`${JOIN_HREF}#pro`} className="underline underline-offset-4">
            See Pro
          </Link>
        </p>
      ) : source.state === "failed" || fileFailed ? (
        <p className="text-[0.88rem] text-[var(--accent-clay-text)]">{"That didn't load. Try again in a moment."}</p>
      ) : null}
    </div>
  );
}

/** The one way in, for someone the code isn't open to yet. */
function WayIn({ block: b, access }: { block: Block; access: Access }) {
  if (b.free && access === "guest")
    return (
      <div className="grid gap-2">
        <Link href={accountHref("signup", b.slug)} className={SOLID}>
          Create a free account
          <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href={accountHref("signin", b.slug)} className="text-center text-[0.88rem] text-[color:rgba(20,20,20,0.6)] underline underline-offset-4 hover:text-[#141414]">
          I have an account
        </Link>
      </div>
    );
  return (
    <div className="grid gap-2">
      <Link href={`${JOIN_HREF}#pro`} className={SOLID}>
        Get the code with Pro
        <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      {access === "guest" ? (
        <Link href={accountHref("signin", b.slug)} className="text-center text-[0.88rem] text-[color:rgba(20,20,20,0.55)] underline underline-offset-4 hover:text-[#141414]">
          Sign in
        </Link>
      ) : null}
    </div>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full text-[color:rgba(20,20,20,0.65)] transition-colors hover:bg-[rgba(20,20,20,0.06)] hover:text-[#141414] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#141414]"
    >
      {children}
    </button>
  );
}

/** What "Copy prompt for Claude" puts on the clipboard: the job, the checks, and the file. */
function prompt(b: Block, source: string, usage: string | null) {
  return `Add this "${b.title}" component to my project.

1. Save it as its own file where my project keeps UI components (for example components/ui/${b.slug}.tsx). Keep it one self-contained file: React only, its CSS inside it.
2. Make it mine: swap its default colours for my theme's colours and let it use my font. Keep the motion and timing exactly as they are.
3. Use it where it fits: [say where, e.g. "the delete button on the project settings page"].${usage ? ` Use it with these settings: ${usage}` : " Read the comment at the top of the file for its props."}
4. If my project uses Tailwind or CSS modules, leave the CSS as it is unless I ask; it is scoped with its own class prefix and won't clash.
5. Check before you finish: it builds, it typechecks, it works with the keyboard, and it respects reduced motion.

\`\`\`tsx
${source.replace(/\n$/, "")}
\`\`\`
`;
}
