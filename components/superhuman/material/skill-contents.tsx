import fs from "node:fs";
import path from "node:path";
import { DownloadGate } from "./download-gate";
import { Commands } from "./product/commands";

/**
 * WHAT IS ACTUALLY IN THE FOLDER.
 *
 * READ FROM DISK, NOT TYPED INTO A DATA FILE. The site's rule is that nothing
 * invents a number, and a hand written file list is a number waiting to go
 * wrong: add a reference file to a skill and the page keeps advertising the
 * old three until somebody notices. This reads the real directory at build
 * time, so the tree on the page is the tree in the download, permanently.
 *
 * Every route under here is generated with `dynamicParams` off, so this runs
 * during the build and never at request time. There is no filesystem access in
 * the deployed page.
 *
 * The line count is the honest measure of a skill. It is the difference
 * between a folder somebody worked on and a folder somebody generated, and it
 * is checkable the second after you download it.
 */

const SKILLS_DIR = path.join(process.cwd(), "public", "construct", "skills");

type SkillFile = { name: string; lines: number };

/**
 * The folder's files, SKILL.md first, then the rest alphabetically. Nested
 * ones keep their folder in the name (references/craft.md), because a skill
 * that files its reference in a subfolder is telling you how to read it.
 */
export function readSkillFiles(slug: string): SkillFile[] {
  const dir = path.join(SKILLS_DIR, slug);
  let files: SkillFile[];

  // THE WHOLE READ IS INSIDE THE TRY, not just the directory listing. A
  // directory named `something.md`, or an unreadable file inside a skill
  // folder, would otherwise throw EISDIR or ENOENT out of a server component
  // and fail the build. The comment used to promise this was handled while
  // the readFileSync sat outside the guard.
  try {
    files = fs
      .readdirSync(dir, { recursive: true, encoding: "utf8" })
      .map((name) => name.split(path.sep).join("/"))
      .filter((name) => name.endsWith(".md") && fs.statSync(path.join(dir, name)).isFile())
      .map((name) => ({
        name,
        // COUNT NEWLINES, do not split on them. Every one of these files ends
        // with a newline, so `split` yields a phantom empty last line and the
        // page printed one more than `wc -l` for every file. The number is
        // advertised as checkable the second after you download it, so it has
        // to agree with the tool somebody will check it with.
        lines: (fs.readFileSync(path.join(dir, name), "utf8").match(/\n/g) ?? []).length,
      }));
  } catch {
    // A skill listed without a folder yet is not a build error: the page
    // simply does not draw a tree it cannot prove.
    return [];
  }

  return files
    .sort((a, b) => {
      if (a.name === "SKILL.md") return -1;
      if (b.name === "SKILL.md") return 1;
      return a.name.localeCompare(b.name);
    });
}

export function SkillContents({
  slug,
  title,
  href,
  install,
}: {
  slug: string;
  title: string;
  href: string;
  /** Steps for a skill that installs itself, printed instead of the paths. */
  install?: string[];
}) {
  const files = readSkillFiles(slug);
  if (files.length === 0) return null;

  const total = files.reduce((n, f) => n + f.lines, 0);

  return (
    <section className="mt-20 border-t border-[var(--hairline)] pt-12 md:mt-24">
      <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
        In the folder · {total.toLocaleString("en-GB")} lines
      </h2>

      {/* ---- the tree ---- */}
      <ul className="mt-6 list-none border-t border-[var(--hairline)]">
        {files.map((file) => (
          <li
            key={file.name}
            className="flex items-baseline justify-between gap-6 border-b border-[var(--hairline)] py-3.5"
          >
            <span
              className={`text-[0.98rem] ${
                file.name === "SKILL.md"
                  ? "text-[var(--accent-clay-text)]"
                  : "text-[color:rgba(11,31,58,0.72)]"
              }`}
            >
              {file.name}
            </span>
            <span className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.14em] tabular-nums text-[color:rgba(11,31,58,0.62)]">
              {file.lines} lines
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-7 max-w-[58ch] text-pretty text-[1.02rem] leading-[1.7] text-[color:rgba(11,31,58,0.68)]">
        SKILL.md is what the agent reads first. The others it opens only when it
        needs them, which is why the first file stays short and the detail lives
        beside it rather than inside it.
      </p>

      {/* ---- installing it ---- */}
      <h3 className="mt-12 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
        Installing it
      </h3>

      {install ? (
        <ol className="mt-5 list-none border-b border-[var(--hairline)]">
          {install.map((step, i) => (
            <li
              key={i}
              className="flex items-baseline gap-5 border-t border-[var(--hairline)] py-4 text-[1.04rem] leading-[1.55] text-[var(--ink)]"
            >
              <span className="w-6 shrink-0 font-mono text-[0.78rem] tracking-[0.1em] text-[var(--accent-clay-text)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <Commands text={step} />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <>
          <p className="mt-4 max-w-[58ch] text-pretty text-[1.02rem] leading-[1.7] text-[color:rgba(11,31,58,0.68)]">
            Unzip it into your skills folder. Use the first path to have it in every
            project on your machine, or the second to keep it inside one project and
            commit it with the code.
          </p>

          <pre className="mt-5 overflow-x-auto border border-[var(--hairline)] bg-[rgba(11,31,58,0.035)] p-5 text-[0.86rem] leading-[1.7] text-[color:rgba(11,31,58,0.82)] md:p-6">
            <code className="font-mono">{`~/.claude/skills/${slug}/SKILL.md      everywhere
.claude/skills/${slug}/SKILL.md       this project only`}</code>
          </pre>
        </>
      )}

      <p className="mt-5 max-w-[58ch] text-pretty text-[1.02rem] leading-[1.7] text-[color:rgba(11,31,58,0.68)]">
        Then type <span className="text-[var(--accent-clay-text)]">/{slug}</span> in
        Claude Code. It also loads on its own when what you are asking for
        matches what the skill is for.
      </p>

      <DownloadGate
        href={href}
        label={`Download ${title}`}
        title={title}
        className="mt-9 inline-flex items-center gap-2.5 rounded-full border border-[var(--hairline-strong)] px-6 py-3 text-[0.98rem] text-[var(--ink)] transition-colors duration-[600ms] ease-out hover:border-[var(--accent-clay)] hover:bg-[rgba(206,70,49,0.06)] hover:text-[var(--accent-clay-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-clay)]"
      />
    </section>
  );
}
