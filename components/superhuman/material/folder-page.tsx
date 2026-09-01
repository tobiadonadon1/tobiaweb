import Link from "next/link";
import { BackLink } from "@/components/ui/back-link";
import { FolderReader } from "./folder-reader";
import { MATERIAL_FOLDERS, folderCount, folderHref } from "./material-data";
import type { MaterialFolder } from "./material-types";

/**
 * A FOLDER'S OWN PAGE.
 *
 * Paper head, then the reader. The head is deliberately NOT the family's tall
 * ink header: the reading pane on this page is already ink, and a full ink
 * header above an ink panel makes the panel stop reading as an object and
 * start reading as the page's background. One ink thing per screen.
 *
 * Everything below the head comes out of the folder object, so a new folder
 * is a new entry in MATERIAL_FOLDERS and a content file. There is no
 * per-folder page to write, and there should never be one.
 */
export function FolderPage({ folder }: { folder: MaterialFolder }) {
  const count = folderCount(folder);
  const others = MATERIAL_FOLDERS.filter((f) => f.id !== folder.id);

  return (
    <main className="paper-bg relative min-h-screen overflow-x-clip text-[#0a0a0a]">
      <BackLink href="/projects/superhuman/material" label="Material" tone="ink" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28 md:pb-32 md:pt-32">
        {/* ---------------------------------------------------------------- *
         * THE HEAD, on paper.
         * ---------------------------------------------------------------- */}
        <header className="max-w-[62ch]">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.45)]">
            Material · {count.label}
          </span>

          <h1 className="mt-4 font-serif text-[clamp(2.4rem,7vw,4.4rem)] leading-[0.98] tracking-[-0.03em] text-[var(--ink)]">
            {folder.name}
          </h1>

          <p className="mt-5 text-pretty text-[1.2rem] leading-[1.45] text-[color:rgba(11,31,58,0.72)] md:text-[1.35rem]">
            {folder.lede}
          </p>

          <div className="mt-7 space-y-5">
            {folder.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-pretty text-[1.05rem] leading-[1.7] text-[color:rgba(11,31,58,0.7)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </header>

        {/* ---------------------------------------------------------------- *
         * THE READER.
         * ---------------------------------------------------------------- */}
        <div className="mt-14 border-t border-[var(--hairline)] pt-10 md:mt-20">
          <FolderReader folder={folder} />
        </div>

        {/* ---------------------------------------------------------------- *
         * THE REST OF THE ROOM.
         * ---------------------------------------------------------------- */}
        <nav
          aria-label="The other folders"
          className="mt-20 border-t border-[var(--hairline)] pt-8 md:mt-28"
        >
          <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.45)]">
            Elsewhere in Material
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {others.map((other) => (
              <li key={other.id}>
                <Link
                  href={folderHref(other.id)}
                  className="group inline-flex items-baseline gap-2 text-[1.05rem] text-[color:rgba(11,31,58,0.6)] transition-colors hover:text-[var(--ink)]"
                >
                  {other.name}
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.38)]">
                    {folderCount(other).total}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
