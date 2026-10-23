import type { ReactNode } from "react";

/**
 * A SMALL TSX/CSS HIGHLIGHTER for the code view: comments, strings, numbers,
 * keywords and JSX tags, in four colours. Not a parser; it only has to make
 * a block's source easy to read, and it adds nothing to the bundle but this.
 */

const RULES: [string, RegExp][] = [
  ["c", /\/\*[\s\S]*?\*\/|\/\/[^\n]*/y],
  ["s", /`(?:\\[\s\S]|\$\{[^}]*\}|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y],
  ["k", /\b(?:import|from|export|default|function|return|const|let|var|if|else|for|of|in|while|type|as|new|null|undefined|true|false|async|await|typeof|keyof|extends|switch|case|break|continue)\b/y],
  ["t", /<\/?[A-Za-z][\w.]*|\/?>/y],
  ["n", /\b\d+(?:\.\d+)?(?:ms|px|deg|s|%|em|rem|vh|vw)?\b|#[0-9a-fA-F]{3,8}\b/y],
  ["p", /[A-Za-z_$][\w$-]*/y],
  ["x", /\s+|./y],
];

const LOOK: Record<string, string> = {
  c: "text-[#8a8478] italic",
  s: "text-[#1e6a48]",
  k: "text-[#b93a26]",
  t: "text-[#2b44c4]",
  n: "text-[#b86a12]",
};

export function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let plain = "";
  const flush = () => {
    if (plain) out.push(plain);
    plain = "";
  };
  while (i < code.length) {
    for (const [kind, re] of RULES) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (!m) continue;
      const text = m[0];
      if (LOOK[kind]) {
        flush();
        out.push(
          <span key={i} className={LOOK[kind]}>
            {text}
          </span>,
        );
      } else plain += text;
      i += text.length;
      break;
    }
  }
  flush();
  return out;
}
