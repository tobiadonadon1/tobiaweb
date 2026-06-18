import Link from "next/link";

const MAIN_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/#road", label: "About" },
  { href: "/#thoughts", label: "Thoughts" },
];

/**
 * The site's last page (21st.dev footer, re-set in Ink & Paper): the logo
 * mark + serif name, quiet mono nav, then the labeled channels captioned by
 * "Figuring it out in public." — and beneath it all, the Line finally ends in
 * its single dot.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-background">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 lg:pt-20">
        <div className="md:flex md:items-start md:justify-between">
          <Link href="/#home" className="flex items-center gap-x-3" aria-label="Tobia Donadon">
            {/* The mark — Tobia's logo, same as the browser tab */}
            {/* eslint-disable-next-line @next/next/no-img-element -- small static brand mark */}
            <img src="/logo.png" alt="" className="h-7 w-7" />
            <span className="font-serif text-2xl tracking-tight text-[#0a0a0a]">
              Tobia Donadon
            </span>
          </Link>

          <nav className="mt-8 md:mt-1">
            <ul className="flex list-none flex-wrap gap-x-7 gap-y-2">
              {MAIN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/45 transition-colors hover:text-black/80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* The channels, captioned by the line Tobia liked (Option B): the
            tagline now sits directly above the labeled mono channel links. */}
        <div className="mt-10 border-t border-black/10 pt-8">
          <p className="font-serif text-base italic text-black/40">
            Figuring it out in public.
          </p>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4">
          {/* The sign-off: the name, not a copyright formality. */}
          <span className="font-serif text-2xl italic text-black/50">
            Tobia Donadon
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-black/25">
            © 2026
          </span>
          {/* The Line ends here. */}
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#0b1f3a]/60" />
        </div>
      </div>
    </footer>
  );
}
