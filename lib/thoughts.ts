/**
 * The Thoughts corpus. A plain data module (no "use client", no server-only
 * APIs) so BOTH the homepage Thoughts section (client) and the
 * /thoughts/[slug] reading page (server) can import it.
 *
 * GENERATED from Tobia's real blog export (Downloads/Blog.csv) — the canonical
 * posts. `bodyHtml` is trusted, authored HTML (his own writing, build-time
 * only) rendered on the reading page. To refresh, re-run the CSV → this file.
 */
export type Thought = {
  slug: string;
  headline: string;
  excerpt: string;
  cover?: string;
  tag?: string;
  readTime?: string; // e.g. "4 min read"
  date?: string; // e.g. "Jun 4, 2026"
  writer?: string;
  /** Authored HTML essay (from the blog export), rendered on the reading page. */
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
    slug: "dev-day-openai",
    headline: "Open AI Dev Day",
    excerpt: "The real shift isn’t more power, it’s less friction between thought and action.",
    cover: "https://framerusercontent.com/images/qJQnfSdagWbUNYBaonO9IPUktk.png",
    tag: "Artificial Intelligence",
    readTime: "1 min read",
    date: "Oct 6, 2025",
    writer: "Tobia Donadon",
    bodyHtml: "<p>I called a friend in San Francisco to ask if he’d watched the OpenAI Dev Conference.<br>He didn’t even know it was happening. He’s in San Francisco.</p><h2>OpenAI released AgentKit and made Codex fully live, and it completely changed how I look at my work.</h2><p><br>It made me realize how my friend in San Francisco focuses on futile things and, with a huge sense of “I don’t care,” is missing the opportunity right in front of us today.<br><br>AgentKit means I can finally stop imagining agents inside ATMO and start building them with a real, approachable SDK.<br>It means I can help my clients scale smarter, automate better, and unlock more growth through the same systems we’ve already built.<br><br>Codex being fully live means AI isn’t just assisting me, it’s coding with me.<br>Testing, patching, optimizing. It feels like having a senior engineer by my side.<br><br>All those nights fixing loops and debugging logic now make sense. They were practice.<br><br>Now I’m rebuilding smarter.<br><br>If you’re not building yet, even with the immense power now literally at our fingertips, you’re missing one of the biggest turning points in human history.<br><br><em>Have the tools finally caught up to our ideas?</em></p>",
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
  {
    slug: "tech-trap",
    headline: "Tired of Tech Traps so I built MakeFunnels",
    excerpt: "No plugins. No connectors. No headaches.",
    cover: "https://framerusercontent.com/images/76VWnNOejALVwRgoF9uDcQNw4kg.jpeg",
    tag: "Start Up",
    readTime: "1 min read",
    date: "Feb 24, 2026",
    writer: "Tobia Donadon",
    bodyHtml: "<p>I saw a brilliant founder quit yesterday.<br><br>He had a great product. He had the audience. But he spent 3 weeks trying to connect his landing page to his email list.<br><br>He wasn't defeated by the market. He was defeated by the \"Tech Trap.\"<br><br>You know the feeling: You just want to launch a simple idea. But suddenly you are managing 4 different subscriptions, fighting with plugins, and watching YouTube tutorials on how to fix your broken analytics.<br><br>It is exhausting. And it kills momentum.<br><br>I refused to let this happen to my next project.<br><br>𝗦𝗼 𝗜 𝗯𝘂𝗶𝗹𝘁 𝗠𝗮𝗸𝗲𝗙𝘂𝗻𝗻𝗲𝗹𝘀.<br><br>We took the entire \"tech stack\" and crushed it into one simple tool.<br><br>No plugins. No connectors. No headaches.<br><br>It handles the whole flow for you:<br><br>→ Generates the full funnel instantly → Collects the emails automatically → Tracks the analytics in real-time → Publishes in one click<br><br>You don't need to be a developer. You just need an idea.<br><br>We are opening the waitlist for early access... you may want to join.<br><br></p>",
  },
  {
    slug: "make-funnels-release",
    headline: "Make Funnels Release",
    excerpt: "MakeFunnels is already generating thousands of dollars for users who have been on the platform for just one week.",
    cover: "https://framerusercontent.com/images/meo9Qfc4vq0ZQs96sJo8Q5AEE.jpeg",
    tag: "Start Up",
    readTime: "1 min read",
    date: "Jan 26, 2026",
    writer: "Tobia Donadon",
    bodyHtml: "<p dir=\"auto\">It’s been 24 hours since we officially launched MakeFunnels to all of you.<br><br>But the real story isn’t the numbers.<br><br>It’s what happened before them, and what we set out to solve for anyone with an idea who wants to bring it into the world.<br><br>We spent months building this.<br>No announcements. No hype.<br><br>Just me and Tommaso; my friend since middle school, working quietly, day after day, focused on the problem.<br><br>We didn’t want to ship another funnel builder.<br><br>We wanted to build an all-in-one tool that actually helps people launch, scale, and bring their business to life, fast.<br><br>The moment this became real for me wasn’t yesterday when we went live.<br><br>It was a few weeks ago, when one of our early users crossed $10k in monthly revenue using a funnel built on MakeFunnels.<br><br>That’s when I looked at Tommaso; who’s been grinding on the marketing side with the same intensity he’s had since we were kids, and said;<br>“Okay. We’re ready.”<br><br>It still feels surreal to see this out in the world.<br><br>To everyone who tested, broke, and helped us improve the early versions: thank you.<br><br>We’re just two friends building the tool we wish we had years ago.<br><br>Now, back to work.<br>We want to give you the best version of it possible.</p>",
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
