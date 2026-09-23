/**
 * What the buyer types, set as code. Only the lowercase commands (claude, hi,
 * /anything) are marked, so "Claude Code" in a sentence stays plain text.
 * Shared by the thank-you page and the product sections, which both print
 * the same three steps.
 */
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-[var(--hairline)] bg-[rgba(11,31,58,0.045)] px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--ink)]">
      {children}
    </code>
  );
}

export function Commands({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s)/).map((part, i) => {
        const word = part.replace(/[.,]$/, "");
        const trail = part.slice(word.length);
        return /^(claude|hi|\/[a-z-]+)$/.test(word) ? (
          <span key={i}>
            <Kbd>{word}</Kbd>
            {trail}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}
