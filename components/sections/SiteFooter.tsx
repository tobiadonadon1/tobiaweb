import Link from "next/link";
import { Mail } from "lucide-react";

const MAIN_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/#road", label: "About" },
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

// Labeled MONO channel links (funnel §3.9): the handle is shown; the two
// external profiles carry rel="me" (identity verification, IndieAuth). IG is
// the personal channel, LinkedIn the professional one, email the direct line.
const CHANNELS = [
  {
    href: "https://www.instagram.com/tobia.donadon/",
    label: "Instagram",
    handle: "@tobia.donadon",
    Icon: InstagramIcon,
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/tobia-donadon",
    label: "LinkedIn",
    handle: "Tobia Donadon",
    Icon: LinkedinIcon,
    external: true,
  },
  {
    href: "mailto:tobia@donadon.com",
    label: "Email",
    handle: "tobia@donadon.com",
    Icon: Mail,
    external: false,
  },
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
          <ul className="mt-5 flex list-none flex-col gap-y-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-9">
            {CHANNELS.map(({ href, label, handle, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  // rel="me" claims these profiles as Tobia's (identity links);
                  // noreferrer/noopener for the external tabs.
                  rel={external ? "me noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-black/45 transition-colors hover:text-cyan-900"
                >
                  <Icon className="h-3.5 w-3.5 text-black/35 transition-colors group-hover:text-cyan-900" />
                  <span>{label}</span>
                  <span aria-hidden className="text-black/20">·</span>
                  <span className="tracking-[0.15em] text-black/35 transition-colors group-hover:text-cyan-900/80 normal-case">
                    {handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
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
