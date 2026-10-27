/**
 * THE MASTERCLASS TRACKS: what the lessons will be about, in the order a
 * friend building their first product would need them. Placeholders until
 * the lessons are filmed: rename, reorder or add a track here and the page
 * (components/masterclass/masterclass-page.tsx) follows. The lessons
 * themselves go in with scripts/shelf-add.mjs (shelf "masterclass") and show
 * up on the page for members as soon as they're in.
 *
 * Each track is a row of videos on the page, like a YouTube channel's
 * categories. (`mark`, `from` and `to` are unused for now.)
 */
export type Track = { id: string; title: string; line: string; mark: string; from: string; to: string };

export const TRACKS: Track[] = [
  { id: "edit", title: "Edit your videos", line: "From your raw footage to a reel worth posting, with Claude doing the cutting.", mark: "video-editor-pro", from: "#2440ff", to: "#0a1238" },
  { id: "build", title: "Build an app", line: "From an idea to a working app, with Claude doing the typing.", mark: "app-designer", from: "#2346e0", to: "#0a1638" },
  { id: "design", title: "Design it properly", line: "Screens that look made by a designer, not generated.", mark: "web-designer", from: "#d4492f", to: "#3b0f18" },
  { id: "launch", title: "Launch and grow", line: "The App Store, X, and your first thousand people.", mark: "app-launcher", from: "#e3a11c", to: "#3a2406" },
  { id: "ai", title: "AI that works for you", line: "Claude Code, skills and agents that do real work.", mark: "skills", from: "#2b9a72", to: "#08281f" },
  { id: "sell", title: "Sell what you make", line: "Skills, guides and memberships people pay for.", mark: "guides", from: "#7f4af2", to: "#1c1140" },
];
