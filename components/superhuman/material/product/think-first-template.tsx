"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { PROMPT } from "./think-first-prompt";

/**
 * PAGE 1 OF THE PDF, ON THE PAGE: the prompt Tobia fills in before he builds
 * anything, word for word (think-first-prompt.ts is generated from the PDF's
 * source, so the two can't drift). Every [bracket] is lit pink; the section
 * names are set in bold. The copy button puts the whole prompt on the
 * clipboard exactly as the PDF has it, brackets and all.
 */

/** A section name: the first line of a block, short, with no bracket or full stop. */
const isTitle = (line: string) => line.length < 28 && !/[[.:,]/.test(line);

/**
 * The prompt in its sections (blank lines apart), so a section never splits across columns. The PDF wraps
 * long lines by hand to fit A4; here those are joined again so the page wraps them itself. A line that ends
 * a sentence, or a "- " line, stays a line of its own.
 */
const unwrap = (lines: string[]) =>
  lines.reduce<string[]>((out, l) => {
    const prev = out[out.length - 1];
    if (prev !== undefined && !/[.:?]$/.test(prev) && !l.startsWith("- ")) out[out.length - 1] = `${prev} ${l.trim()}`;
    else out.push(l);
    return out;
  }, []);
const BLOCKS = PROMPT.split(/\n\s*\n/).map((b) => {
  const lines = b.split("\n");
  return isTitle(lines[0]) ? [lines[0], ...unwrap(lines.slice(1))] : unwrap(lines);
});

/** Sections shown before "Show the whole prompt". */
const SHOWN = 4;

function Line({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]*\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <span key={i} className="tf-br">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function ThinkFirstTemplate() {
  const [copied, setCopied] = useState(false);
  // The first sections, then the rest on a tap: the whole prompt is about 2.5 phone screens.
  const [open, setOpen] = useState(false);
  const blocks = open ? BLOCKS : BLOCKS.slice(0, SHOWN);
  const brackets = (PROMPT.match(/\[[^\]]*\]/g) ?? []).length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT);
    } catch {
      // Older browsers: a hidden field and the old command.
      const ta = document.createElement("textarea");
      ta.value = PROMPT;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="tf-glass tf-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="tf-mono m-0 text-[0.78rem] tracking-[0.04em]">
          1 prompt · {brackets} brackets · paste into Claude Code or Codex
        </p>
        <button type="button" className="tf-copy" onClick={copy}>
          {copied ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
          {copied ? "Copied" : "Copy the prompt"}
        </button>
      </div>
      <div id="tf-prompt" className="tf-prompt mt-6" data-closed={open ? undefined : ""}>
        {blocks.map((b, bi) => (
          <div key={bi} className="tf-prompt__block">
            {b.map((l, i) =>
              i === 0 && isTitle(l) ? (
                <p key={i} className="tf-prompt__title">
                  {l}
                </p>
              ) : (
                <p key={i} className="tf-prompt__line">
                  <Line text={l} />
                </p>
              ),
            )}
          </div>
        ))}
      </div>
      {open ? null : (
        <button type="button" className="tf-more" aria-expanded={false} aria-controls="tf-prompt" onClick={() => setOpen(true)}>
          Show the whole prompt · {BLOCKS.length - SHOWN} more sections
          <ChevronDown aria-hidden className="h-4 w-4" />
        </button>
      )}
      <span role="status" className="sr-only">
        {copied ? "Prompt copied" : ""}
      </span>
    </div>
  );
}
