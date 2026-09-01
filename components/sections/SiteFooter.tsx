import Link from "next/link";
import { FooterReveal } from "@/components/sections/footer-reveal";

const LINKS = [
  { href: "/#projects", label: "Projects" },
  { href: "/#thoughts", label: "Thoughts" },
  { href: "mailto:tobia@donadon.com", label: "Email" },
];

/**
 * THE LAST PAGE.
 *
 * It does not scroll up into view like the rest of the site. It is already
 * there, pinned to the bottom of the viewport underneath everything, and the
 * page slides UP OFF it as you reach the end. So the site does not finish with
 * one more block of content; it finishes by getting out of the way and showing
 * you what was behind it the whole time.
 *
 * The mechanism is two rules and no JavaScript: this footer is `fixed` at
 * z-0, and `.site-content` in globals.css is `relative`, z-10, opaque, and
 * carries a bottom margin exactly `--footer-h` tall. That margin is the only
 * thing that has to stay in step with the height below.
 *
 * The old footer printed his name twice, ran four uppercase mono links at 45%
 * black, and closed on a copyright line. This one says the name once, centred,
 * large, filling with blue as the page leaves, and closes on the sentence that
 * is actually true.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <FooterReveal />
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-between px-6 pb-10 pt-14 md:pb-12 md:pt-16">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <Link
            href="/#home"
            className="group flex items-center gap-x-3"
            aria-label="Tobia Donadon, back to the top"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- small static brand mark */}
            <img src="/logo.png" alt="" className="h-6 w-6" />
            <span className="text-[0.95rem] text-[color:rgba(11,31,58,0.55)] transition-colors duration-300 group-hover:text-[var(--ink)]">
              Back to the top
            </span>
          </Link>

          <nav>
            <ul className="flex list-none flex-wrap gap-x-8 gap-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.95rem] text-[color:rgba(11,31,58,0.55)] underline decoration-[rgba(11,31,58,0.18)] underline-offset-[6px] transition-colors duration-300 hover:text-[var(--ink)] hover:decoration-[rgba(11,31,58,0.5)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* THE NAME, CENTRED, FILLING FROM THE BOTTOM AS THE PAGE LEAVES.

            `--reveal` runs 0 to 1 across the last screen of scroll (see
            footer-reveal.tsx). It is not used to switch a colour on: it is the
            WATERLINE, and every stop of the gradient below is written relative
            to it, so what rises up the letters is a real level.

            Two layers, both clipped to the glyphs themselves:

            1 THE FILL. One vertical ramp whose stops move with the waterline —
              deep navy at the bottom, royal through the middle, and a lit sky
              crest in the last few percent BEFORE the line, so the level has a
              bright edge that travels up the letters with it. Above the line
              the letters are the faint ghost they start as. It is one hue
              family throughout: navy, royal, sky. Never a second colour.

            2 THE LIGHT. A narrow highlight that sweeps across the word on a
              slow loop, masked to whatever is filled so far, so the filled
              part is never completely still even when the page is. It stops
              under prefers-reduced-motion (see `.footer-name-fill`).

            An earlier pass brightened the whole word at once, and a later one
            set it flat left. Neither is what was asked for: this is a level
            rising, centred, and it should look alive while it does it. */}
        <div className="relative select-none text-center">
          <span
            aria-hidden
            className="block whitespace-nowrap text-center font-serif text-[clamp(2.6rem,11.4vw,9rem)] leading-[0.82] tracking-[-0.03em]"
            style={{
              backgroundImage:
                "linear-gradient(to top," +
                " #0b1f3a 0%," +
                " #163a7e calc(var(--reveal, 0) * 100% - 55%)," +
                " #2a63c8 calc(var(--reveal, 0) * 100% - 22%)," +
                " #56a8ee calc(var(--reveal, 0) * 100% - 3%)," +
                " rgba(11,31,58,0.11) calc(var(--reveal, 0) * 100% + 7%)," +
                " rgba(11,31,58,0.11) 200%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            Tobia Donadon
          </span>

          {/* The travelling light. Same type, same metrics, masked to the part
              of the word that has already filled. */}
          <span
            aria-hidden
            className="footer-name-fill pointer-events-none absolute inset-0 block whitespace-nowrap text-center font-serif text-[clamp(2.6rem,11.4vw,9rem)] leading-[0.82] tracking-[-0.03em]"
            style={{
              backgroundImage:
                "linear-gradient(100deg," +
                " rgba(140,205,255,0) 0%," +
                " rgba(160,215,255,0.62) 48%," +
                " rgba(140,205,255,0) 100%)",
              backgroundSize: "34% 100%",
              backgroundRepeat: "no-repeat",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
              WebkitMaskImage:
                "linear-gradient(to top, #000 0%," +
                " #000 calc(var(--reveal, 0) * 100%)," +
                " rgba(0,0,0,0) calc(var(--reveal, 0) * 100% + 4%))",
              maskImage:
                "linear-gradient(to top, #000 0%," +
                " #000 calc(var(--reveal, 0) * 100%)," +
                " rgba(0,0,0,0) calc(var(--reveal, 0) * 100% + 4%))",
            }}
          >
            Tobia Donadon
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-[rgba(11,31,58,0.1)] pt-6">
          <p className="font-serif text-lg italic text-[color:rgba(11,31,58,0.45)]">
            Figuring it out in public.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[0.8rem] text-[color:rgba(11,31,58,0.3)]">
              2026
            </span>
            {/* The Line, which has run the whole site, ends here. */}
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[rgba(11,31,58,0.5)]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
