import Link from "next/link";
import { Mail } from "lucide-react";

const MAIN_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/#thoughts", label: "Thoughts" },
];

// lucide dropped brand icons — tiny inline mark instead.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

// TODO(Tobia): add Instagram/LinkedIn URLs when ready (inline icons like GitHub's).
const SOCIAL_LINKS = [
  { href: "mailto:tobia@donadon.com", label: "Email", Icon: Mail },
  { href: "https://github.com/tobiadonadon1", label: "GitHub", Icon: GithubIcon },
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
            {/* The comet — same mark as the browser tab */}
            <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden>
              <path
                d="M55 10 C 44 17, 32 26, 21 39"
                stroke="#0b1f3a"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <circle cx="18" cy="45" r="10" fill="#0b1f3a" />
              <circle cx="14.5" cy="41.5" r="3.2" fill="#67e8f9" opacity="0.95" />
            </svg>
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

        <div className="mt-10 flex flex-col items-center gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-black/30">
            © 2026 Tobia Donadon
          </span>
          {/* The Line ends here. */}
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#0b1f3a]/60" />
        </div>
      </div>
    </footer>
  );
}
