/**
 * THE MASTERCLASS TRACKS: what the lessons will be about, in the order a
 * friend building their first product would need them. Placeholders until
 * the lessons are filmed: rename, reorder or add a track here and the page
 * (components/masterclass/masterclass-page.tsx) follows. The lessons
 * themselves go in with scripts/shelf-add.mjs (shelf "masterclass") and show
 * up on the page for members as soon as they're in.
 *
 * `mark` is a cut-paper drawing from material/specimens.tsx; `from`/`to` is
 * the poster's colour, deep enough to carry white type.
 */
export type Track = { id: string; title: string; line: string; mark: string; from: string; to: string };

export const TRACKS: Track[] = [
  { id: "build", title: "Build an app", line: "From an idea to a working app, with Claude doing the typing.", mark: "app-designer", from: "#2346e0", to: "#0a1638" },
  { id: "design", title: "Design it properly", line: "Screens that look made by a designer, not generated.", mark: "web-designer", from: "#d4492f", to: "#3b0f18" },
  { id: "launch", title: "Launch and grow", line: "The App Store, X, and your first thousand people.", mark: "app-launcher", from: "#e3a11c", to: "#3a2406" },
  { id: "ai", title: "AI that works for you", line: "Claude Code, skills and agents that do real work.", mark: "skills", from: "#2b9a72", to: "#08281f" },
  { id: "sell", title: "Sell what you make", line: "Skills, guides and memberships people pay for.", mark: "guides", from: "#7f4af2", to: "#1c1140" },
];
