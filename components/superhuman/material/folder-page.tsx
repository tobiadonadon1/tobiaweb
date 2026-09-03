import { BackLink } from "@/components/ui/back-link";
import { MaterialList } from "./material-list";
import { MaterialRack } from "./material-rack";
import { folderCount } from "./material-data";
import type { MaterialFolder } from "./material-types";

/**
 * A FOLDER'S OWN PAGE.
 *
 * Paper head, then the list. There is no ink header any more and no nav to the
 * other folder at the foot. Both were removed for the same reason: the back
 * link at the top already goes to a grid showing every folder there is, so a
 * footer repeating that is the page offering you a door you are standing next
 * to.
 *
 * The head is three things and stops. A label carrying the only number worth
 * printing, the name at display size, and one sentence. The paragraph under it
 * is the folder's `intro`, which is a single paragraph by rule: the list below
 * is about to say what is in here far better than a preamble can.
 *
 * Everything below the head comes out of the folder object, so a new folder is
 * an entry in MATERIAL_ROOM_FOLDERS and a content file. There is no per folder
 * page to write, and there should never be one.
 */
export function FolderPage({ folder }: { folder: MaterialFolder }) {
  const count = folderCount(folder);
  // BOTH OPEN FOLDERS GET THE RACK. The parked folders have no marks drawn
  // for their entries, so they keep the list and cannot render an empty
  // picture frame.
  const isRack = folder.id === "skills" || folder.id === "guides";

  return (
    <main className="paper-bg relative min-h-screen overflow-x-clip text-[#0a0a0a]">
      <BackLink href="/projects/construct/material" label="Material" tone="ink" />

      {/* THE FRAME FOLLOWS THE CONTENTS. The rack needs three columns and the
          list needs a reading measure, and one width cannot serve both: at
          6xl the guides rows stranded half the page, and at 4xl the skill
          columns were too narrow to give a mark any size. */}
      <div
        className={`mx-auto w-full px-6 pb-28 pt-28 md:pb-36 md:pt-36 ${
          isRack ? "max-w-6xl" : "max-w-4xl"
        }`}
      >
        <header>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:rgba(11,31,58,0.62)]">
            Material · {count.label}
          </span>

          <h1 className="mt-5 font-serif text-[clamp(2.8rem,9vw,5rem)] leading-[0.95] tracking-[-0.035em] text-[var(--ink)]">
            {folder.name}
          </h1>

          {/* Both are empty on the two open folders now, and the head simply
              stops. A folder page that opens with a slogan and then a
              paragraph about what a folder is has put two things between you
              and the three items you came for. The parked folders still carry
              theirs, so both still render wherever they exist. */}
          {folder.lede ? (
            <p className="mt-6 max-w-[36ch] text-pretty text-[1.3rem] leading-[1.35] tracking-[-0.01em] text-[var(--ink)] md:text-[1.55rem]">
              {folder.lede}
            </p>
          ) : null}

          {folder.intro.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="mt-6 max-w-[58ch] text-pretty text-[1.05rem] leading-[1.7] text-[color:rgba(11,31,58,0.68)]"
            >
              {paragraph}
            </p>
          ))}
        </header>

        {/* The two open folders get the rack. The parked ones keep the list,
            because nothing has drawn marks for their entries. */}
        <div className="mt-14 md:mt-16">
          {isRack ? (
            <MaterialRack folder={folder} />
          ) : (
            <MaterialList folder={folder} />
          )}
        </div>
      </div>
    </main>
  );
}
