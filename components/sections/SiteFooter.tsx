import Link from "next/link";

const MAIN_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/#thoughts", label: "Thoughts" },
];

// Labeled channels — the echo, not the ask. Handle-as-text beats anonymous
// icons: no one has to hover to know where a link goes. rel="me" on the real
// profiles consolidates his identity around the name.
const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/tobia.donadon/", text: "Instagram @tobia.donadon" },
  { href: "https://www.linkedin.com/in/tobia-donadon", text: "LinkedIn" },
  { href: "mailto:tobia@donadon.com?subject=Hi%20Tobia", text: "Email" },
];

/**
 * The site's last page (21st.dev footer, re-set in Ink & Paper): the comet
 * mark + serif name, quiet mono links, social circles — and beneath it all,
 * the Line finally ends in its single dot.
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

          <div className="mt-8 flex flex-col gap-3 md:mt-0 md:items-end">
            {/* The beloved tagline now captions the channels (Option B). */}
            <p className="font-serif text-base italic text-black/40">
              Figuring it out in public.
            </p>
            <ul className="flex list-none flex-wrap gap-x-5 gap-y-2 md:justify-end">
              {SOCIAL_LINKS.map(({ href, text }) => (
                <li key={text}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "me noreferrer" : undefined}
                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-black/45 transition-colors hover:text-black/80"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black/10 pt-8 md:flex md:items-baseline md:justify-end">
          <nav>
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

        <div className="mt-12 flex flex-col items-center gap-4">
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
