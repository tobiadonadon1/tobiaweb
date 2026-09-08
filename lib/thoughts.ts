/**
 * The Thoughts corpus. A plain data module (no "use client", no server-only
 * APIs) so BOTH the homepage Thoughts section (client) and the
 * /thoughts/[slug] reading page (server) can import it.
 *
 * Seeded from Tobia's real blog export and extended with his newer drafts.
 * `bodyHtml` is trusted, authored HTML (his own writing, build-time only)
 * rendered on the reading page.
 */
export type Thought = {
  slug: string;
  headline: string;
  excerpt: string;
  cover?: string;
  coverAlt?: string;
  coverFit?: "cover" | "contain";
  tag?: string;
  readTime?: string; // e.g. "4 min read"
  date?: string; // e.g. "Jun 4, 2026"
  writer?: string;
  /** Authored HTML essay, rendered on the reading page. */
  bodyHtml?: string;
  /** Legacy plain-text paragraphs (kept for forward-compat; unused by the CSV posts). */
  body?: string[];
};

export const THOUGHTS: Thought[] = [
  {
    slug: "clarity-is-rare-because-its-unconfortable",
    headline: "Clarity Is Rare Because It’s Uncomfortable",
    excerpt: "Most people move fast to avoid seeing what matters.",
    cover: "https://framerusercontent.com/images/PNt0g90oVw4MgzIehKDzpo8Y.jpg",
    tag: "Consciousness",
    readTime: "1 min read",
    date: "Dec 18, 2025",
    writer: "Tobia Donadon",
    bodyHtml: "<p dir=\"auto\">Most people don't lack intelligence. They lack the willingness to sit with things long enough for them to become clear.</p><p dir=\"auto\">Clarity has a cost. It asks you to slow down, remove noise, and admit when something doesn't make sense yet. In a world that rewards speed and reaction, this feels counterintuitive. So we replace clarity with motion. We stay busy. We ship before we understand.</p><p dir=\"auto\">But when you look closely, the people building things that last are never in a rush to appear decisive. They're patient with uncertainty. They let questions stay open longer than feels socially comfortable. They think before they speak. They reduce instead of adding.</p><p dir=\"auto\">Clarity isn't about having answers. It's about knowing what actually matters.</p><p dir=\"auto\">Everything I build starts there. Not with ambition, but with reduction. Cutting away what's unnecessary until the core becomes visible. Only then does execution make sense.</p><p dir=\"auto\">Most progress isn't blocked by a lack of ideas. It's blocked by a lack of honesty.</p>",
  },
  {
    slug: "ipulse-interview",
    headline: "iPulse Interview: Building With Intention",
    excerpt: "On awareness, transformation, and creating what matters.",
    cover: "https://framerusercontent.com/images/757mbosGr3RTUE9ehOFiPG99g.jpg",
    tag: "Interview",
    readTime: "1 min read",
    date: "Mar 21, 2025",
    writer: "Tobia Donadon",
    bodyHtml: "<p>My motivation: to create a positive impact on people and society, ⁠to contribute to the evolution by humanity.</p><p>This week, I had the honor of being featured in the Student Spotlight by iPulse. In the interview, I introduced my upcoming book A.C.T. - Awareness, Conscious, Transformation: a project born from the desire to elevate self-awareness and self-growth.</p><p>Here's the full interview:</p><p><br></p>",
  },
  {
    slug: "you-are-replaceable",
    headline: "You Are Replaceable. Your Thinking Is Not.",
    excerpt: "Execution scales. Judgment does not.",
    cover: "https://framerusercontent.com/images/x3ebvkS06qAdLb0otRAfcZeUG38.jpeg",
    tag: "Artificial Intelligence",
    readTime: "1 min read",
    date: "Oct 21, 2025",
    writer: "Tobia Donadon",
    bodyHtml: "<h2>You are replaceable.</h2><p>Your tasks, your process, your role—they can be automated, delegated, or scaled down.<br><br>But there’s something no algorithm can ever replicate: your thought.<br>Not the data. Not the process. Not the outputs. The way you think.<br><br>AI continues to raise the floor of what execution looks like. For example:<br>Google DeepMind just released Gemini Robotics 1.5 / ER 1.5, systems that can now perform multi-step physical tasks—like sorting laundry or classifying recyclables—with planning, adaptation, and tool use.<br>These machines can do. They still cannot decide.<br><br>That’s where we come in.<br>We don’t just execute. We choose. We imagine. We give meaning to direction.<br><br>Let machines handle the busywork.<br>You think.<br><strong>You point the way forward.</strong></p>",
  },
  {
    slug: "replit",
    headline: "Everyone Is a Builder Now",
    excerpt: "The distance between intention and execution is collapsing.",
    cover: "https://framerusercontent.com/images/FrX7vLW1DWSONxm3nzW7OwfLeCo.jpg",
    tag: "Artificial Intelligence",
    readTime: "1 min read",
    date: "Oct 10, 2025",
    writer: "Tobia Donadon",
    bodyHtml: "<h3>Replit Agent 3 is not just another coding assistant. </h3><p>It’s a step change in how ideas become reality. With a single prompt, you can generate an entire application — frontend, backend, logic, and structure.<br><br>Compared to Claude Code, the difference is striking. Replit’s execution is faster, sharper, and closer to what founders and developers actually need. It doesn’t just generate code — it runs, tests, and debugs functions on its own, surfacing issues without you ever lifting a finger.<br><br>I’ve seen it firsthand. I gave it a prompt, went to the gym, and two hours later got a notification: “your project is ready.” It worked, tested, and shipped while I was away from my Mac.<br><br>It almost feels like I never stop working... as if I suddenly have a team working for me, faster and with less friction than I ever could. <br><br>Everyone is now a builder.</p>",
  },
  {
    slug: "i-send-it-and-i-leave",
    headline: "I Send It, and I Leave",
    excerpt: "A note on GPT-6 Astra, and the morning it gave back to me.",
    cover: "/thoughts/astra.png",
    coverAlt: "GPT-6 Astra launch still, spiral of stars",
    tag: "Artificial Intelligence",
    readTime: "2 min read",
    date: "Sep 8, 2026",
    writer: "Tobia Donadon",
    bodyHtml:
      "<p>I wake up. The house is quiet. I write one broad prompt, the kind that used to eat the whole morning, and I put the phone down.</p>" +
      "<p>Then I leave.</p>" +
      "<p>Coffee. A walk. The part of the day that is actually a life. About two hours later the phone lights up. Done. I open it, and the outcome is the one I wanted. Not a draft I have to rescue. The thing.</p>" +
      "<p>That is why I love the GPTs now. They work. They are efficient in a way that feels almost polite. They check their own work, so I am not sitting in the middle of the loop like a tired teacher, saying try again.</p>" +
      "<p>Astra is the one that made this feel complete. It takes the wide ask and it stays with it. Research. The next step. The check. It does not wait for me to approve every breath. I come back and the brief is already satisfied.</p>" +
      "<p>People will argue about the word AGI. I don't need the argument. This is the power. I can be gone, and the work still happens, and it holds itself to a standard before I see it.</p>" +
      "<p>Fable 5 did this for me first. Then Fable 5.1. The day stopped being me, waiting on a machine. Astra is the next room of that same life. The quality is sensational, and it is cheap next to Fable, which still surprises me. It thinks more. I feel that in the result, not on a chart. And it stays in its own family. The image, the page, the rest of the job, it can carry them without calling out to some other tool the way Claude does. One house. The work travels together.</p>" +
      "<p>What we can build from here is a morning that belongs to you again. You set the aim. You go live. The notification is the proof.</p>" +
      "<p><em>Still: OpenAI launch page, September 2026. <a href='https://openai.com/index/gpt-6-astra/'>openai.com/index/gpt-6-astra/</a></em></p>",
  },
  {
    slug: "the-long-beautiful-build",
    headline: "The Long Beautiful Build",
    excerpt: "A note on Fable, and the studio that does not sleep.",
    cover: "/thoughts/fable.png",
    coverAlt: "Claude Fable 5.1 and Mythos 5.1, moon over blue sky",
    tag: "Artificial Intelligence",
    readTime: "2 min read",
    date: "Sep 8, 2026",
    writer: "Tobia Donadon",
    bodyHtml:
      "<p>Fable 5 taught me the loop. Same care, again, until the thing is finished. I did not have to stay in the chair for the middle of it. Fable 5.1 took that further. Longer work. A build I could trust enough to leave the room and go be a person.</p>" +
      "<p>I still open it when I want the careful object. The page that has to feel like me. The piece of software that has to hold. Fable is patient in a way I like. It will stay with a hard build until the build is worthy of a name.</p>" +
      "<p>Then Astra arrived, and the morning got a second door. I send Astra the wide prompt. The research, the reach, the picture, the next step, all inside one family, cheaper, and the work comes back sensational. Fable is who I call when the dream needs a pair of hands that will not rush the beautiful part.</p>" +
      "<p>Together they are a small studio that does not sleep. One opens the idea. One finishes the object. I walk between them. I get a notification. I come back to a life that moved while I was outside.</p>" +
      "<p>The future I want is not a single model on a throne. It is this. A person with a large aim, and machines that love the work enough to verify it, so the person can go outside and still meet something true before lunch.</p>" +
      "<p><em>Still: Anthropic launch page, official image. <a href='https://www.anthropic.com/claude-fable-and-mythos-5-1'>anthropic.com/claude-fable-and-mythos-5-1</a></em></p>",
  },
  {
    slug: "the-place-between",
    headline: "The Place Between",
    excerpt: "A note on health, and the room I want to build.",
    cover: "/thoughts/signal.png",
    coverAlt: "Vagus nerve branch prevalence by organ target",
    coverFit: "contain",
    tag: "Health",
    readTime: "2 min read",
    date: "Sep 8, 2026",
    writer: "Tobia Donadon",
    bodyHtml:
      "<p>The body is not a machine you optimize. It is the place a life is actually lived. The mind already knows things the chart does not. A tightness. A morning that is off. A sentence you cannot finish because the body spoke first.</p>" +
      "<p>Med tech matters because that gap is still too wide. We can see almost anything, and we still miss the quiet signal. I want to work in the space between the mind, the body, and the tool. Not to replace the person who knows how to heal. To make the signal honest, and to give it back to the person it belongs to.</p>" +
      "<p>The same thing I love in the models is what I want here. A system that checks its own work. A morning where you are not sitting in the middle of the fear. You set the aim. You live. You come back to something true.</p>" +
      "<p>What we can build is small and serious. A way to listen longer than a visit. A record that belongs to you. A tool that does not shout a diagnosis it has not earned. The future of health, for me, is not a smarter hospital. It is a person who can feel the mind and the body in the same hour, with tech that stays in service of that, and never the other way around.</p>" +
      "<p>I would like to spend years in that room. The models taught me I can leave and the work continues. Health is the work I do not want to leave unfinished.</p>" +
      "<p><em>Still: Fig. 3, 2026 vagus-nerve atlas. <a href='https://www.biorxiv.org/content/10.64898/2026.05.08.723047v2'>biorxiv.org/content/10.64898/2026.05.08.723047v2</a></em></p>",
  },
  {
    slug: "when-an-idea-starts-breathing",
    headline: "When an Idea Starts Breathing",
    excerpt: "Creation begins the moment control gives way to trust.",
    cover: "https://framerusercontent.com/images/2fmPp5e8E9XtoIN6cx6yI67Q.jpeg",
    tag: "Start Up",
    readTime: "1 min read",
    date: "Oct 16, 2024",
    writer: "Tobia Donadon",
    bodyHtml: "<p>What does it really feel like to create something, and then watch it grow?</p><p>It's strange.</p><p>You start with an idea, a line of code, a late-night thought that feels too big for you. The next day, you tell your very close friend about it... and then one day, it starts breathing. You see it working, evolving, shaping itself into something real.</p><p>Today was one of those days. Not because everything was perfect, but because it worked. The small details came together, the system started flowing, and suddenly the vision felt alive.</p><p>Building something like this teaches you patience. It humbles you. It reminds you that creation isn't about control, it's about staying in motion, refining, and trusting the process even when it looks chaotic.</p><p><strong>Every commit feels like a heartbeat. Every breakthrough feels like proof that this is worth it.</strong></p><p>Grateful to be building something that might, one day, help others build themselves.</p>",
  },
  {
    slug: "if-you-outsource-your-thinking-you-outsource-your-life",
    headline: "If You Outsource Your Thinking, You Outsource Your Life",
    excerpt: "Freedom comes from clarity, not from doing more.",
    cover: "https://framerusercontent.com/images/KkXoJaZCVmn2eLJJBfXw70qzdk.jpeg",
    tag: "Artificial Intelligence",
    readTime: "1 min read",
    date: "Nov 28, 2025",
    writer: "Tobia Donadon",
    bodyHtml: "<p>If you outsource your thinking, you outsource your life. Productivity has never been about doing more. It has always been about becoming more, creating more, giving more. Most of today's tools don't help us become anything.</p><p>They give us lists, reminders, endless notifications. They make us busier, not better. They add clutter to our lives without moving us in a straight direction.</p><p>Al changes that. But only if we use it with intention. Al should not be the one making our choices.</p><p>It should not decide our direction. That is our responsibility, the responsibility of thought, of vision, of clarity.</p><p>I am a firm believer in Al doing the heavy lifting. It can execute, build, organize, and carry out the structures we design. It can turn a thought into a system, a vision into a routine, an idea into a living framework.</p><p><strong>Humans lead with thought. Al follows with execution. That is the future we should be moving toward.</strong></p><p>Not a world where machines think for us, but a world where we think with more freedom, because the machine handles the weight.</p>",
  },
];

export function getThought(slug: string): Thought | undefined {
  return THOUGHTS.find((t) => t.slug === slug);
}

// Tag → where its label links (funnel-strategy §3.7). Tags missing here render
// as plain labels. Categories come from the blog export.
export const TAG_HREF: Record<string, string> = {
  Consciousness: "/projects/book",
  "Artificial Intelligence": "/#projects",
  "Start Up": "/#projects",
};
