import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BackLink } from "@/components/ui/back-link";
import { VideoFrame } from "@/components/ui/video-frame";
import { ShelfHead, ShelfRest } from "../shelf-chrome";
import { SHELF_BY_ID } from "../shelf-data";
import { FolderCover } from "./folder-cover";
import {
  MATERIAL_FOLDERS,
  MATERIAL_READY,
  MATERIAL_TOTAL,
  folderCount,
  folderHref,
} from "./material-data";
import type { MaterialFolder } from "./material-types";

/**
 * THE ROOM — /projects/construct/material
 *
 * Material is the only family with enough in it to need somewhere to stand
 * before you start reading, so it gets a room rather than a list: six folders
 * as cards, each with a drawn cover, and nothing to do on this page except
 * choose one.
 *
 * WHAT IS BORROWED FROM A CLASSROOM AND WHAT IS NOT. The grid of covered
 * cards is borrowed, because it is genuinely the clearest way to show that
 * six unlike things sit at the same level. The progress bar is not. A
 * progress bar on a card like this is a claim about the reader, and the
 * reader has not agreed to be measured. The rule under each card is a claim
 * about the MATERIAL instead: how much of what is listed is actually
 * finished. A folder of six unfilmed videos says so on its own face.
 *
 * THE FILM COMES FIRST. Six folders is a choice, and a choice is easier to
 * make after somebody has told you how the thing is meant to be used. The
 * frame sits above the grid and says out loud that it is not shot yet — the
 * same rule the video folder runs on, and the reason there is no fake play
 * button on it.
 *
 * Nothing else on this page has state and nothing animates on scroll. It is
 * the junction between the shelf and the reading, and a junction should be
 * quick.
 */

function Card({ folder }: { folder: MaterialFolder }) {
  const count = folderCount(folder);
  const fraction = count.total === 0 ? 0 : count.ready / count.total;

  return (
    <li>
      <Link
        href={folderHref(folder.id)}
        className="group flex h-full flex-col border border-[var(--hairline)] bg-[var(--paper)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--hairline-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-sky)]"
      >
        {/* ---- the cover ---- */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--muted)]">
          <FolderCover
            id={folder.id}
            accent={folder.accent}
            className="absolute inset-0 h-full w-full transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
          />
        </div>

        {/* ---- the type ---- */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-serif text-[1.5rem] leading-tight tracking-tight text-[var(--ink)]">
            {folder.name}
          </h3>

          <p className="mt-2 flex-1 text-pretty text-[0.98rem] leading-[1.55] text-[color:rgba(11,31,58,0.62)]">
            {folder.line}
          </p>

          {/* ---- what the folder can honestly claim ---- */}
          <div className="mt-6">
            <div
              aria-hidden
              className="h-px w-full bg-[var(--hairline)]"
            >
              <div
                className="h-px bg-[var(--ink)]"
                style={{ width: `${Math.round(fraction * 100)}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.45)]">
                {count.label}
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--accent-sky)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export function MaterialRoom() {
  const family = SHELF_BY_ID.material;

  return (
    <main className="paper-bg relative overflow-x-clip text-[#0a0a0a]">
      <BackLink href="/projects/construct#shelf" label="The shelf" tone="ink" />

      <ShelfHead
        title={family.name}
        lede={family.page.lede}
        status={`${MATERIAL_TOTAL} pieces, ${MATERIAL_READY} finished. Free, and it stays free.`}
      />

      <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-4 md:pb-32">
        <div className="max-w-[62ch] space-y-6">
          {family.page.intro.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-pretty text-[1.08rem] leading-[1.7] text-[color:rgba(11,31,58,0.78)]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* ---- the approach, in Tobia's own voice ---- *
         * TODO(tobia): when the film exists, add source={{ kind: "youtube",
         * id: "..." }} and the frame stops saying it is unmade. */}
        <div className="mt-14 max-w-[52rem] md:mt-16">
          <VideoFrame
            tone="paper"
            poster="/trail/trail-06.jpg"
            posterAlt="Tobia standing outside at night in a white t-shirt, hands in his pockets."
            caption="How I actually work, and how to use what is in here"
            pending="Not filmed yet"
          />
        </div>

        <h2 className="mt-16 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.45)] md:mt-20">
          Six folders
        </h2>

        <ul className="mt-6 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIAL_FOLDERS.map((folder) => (
            <Card key={folder.id} folder={folder} />
          ))}
        </ul>

        <ShelfRest currentId="material" />
      </section>
    </main>
  );
}
