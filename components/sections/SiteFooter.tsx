import Link from "next/link";
import { Mail } from "lucide-react";

const MAIN_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/#thoughts", label: "Thoughts" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.4 8.1h4.2V23H.4V8.1Zm7.1 0h4.02v2.03h.06c.56-1.06 1.93-2.18 3.97-2.18 4.25 0 5.03 2.8 5.03 6.44V23h-4.19v-7.4c0-1.77-.03-4.05-2.47-4.05-2.47 0-2.85 1.93-2.85 3.92V23H7.5V8.1Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: "mailto:tobia@donadon.com", label: "Email", Icon: Mail },
  { href: "https://www.instagram.com/tobia.donadon/", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.linkedin.com/in/tobia-donadon", label: "LinkedIn", Icon: LinkedinIcon },
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

          <ul className="mt-8 flex list-none gap-3 md:mt-0">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/25 hover:text-cyan-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-black/10 pt-8 md:flex md:items-baseline md:justify-between">
          <p className="font-serif text-base italic text-black/40">
            Figuring it out in public.
          </p>
          <nav className="mt-6 md:mt-0">
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
