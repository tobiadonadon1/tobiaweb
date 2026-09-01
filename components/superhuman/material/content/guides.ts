import type { MaterialEntry } from "../material-types";

/**
 * GUIDES — the long ones. Each is a walkthrough of something I have actually
 * done, written as a record rather than a lesson: this is what I did, this is
 * the part that went wrong, this is what I would do again.
 */
export const GUIDES: MaterialEntry[] = [
  {
    slug: "pick-a-school",
    title: "How to pick a school",
    kind: "guide",
    summary: "One way of making. Stay until you can do a piece without looking.",
    minutes: 7,
    status: "ready",
    when: "You have a pile of courses, tools, or teachers, and none of them has stuck.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "A school is a way of making, held long enough that your hands know it. It is not a brand, a guru, or a folder of half-watched videos.",
      },
      { type: "h", text: "What you are actually choosing" },
      {
        type: "p",
        text: "You are choosing constraints. One stack, one voice, one kind of piece you will finish. The rest is noise that feels like progress.",
      },
      { type: "h", text: "How to pick" },
      {
        type: "steps",
        items: [
          "Name the piece you need to ship in the next two weeks. Not the career. The piece.",
          "Pick the school that has already shipped that kind of piece, in public, recently.",
          "Ignore anything that talks about becoming someone. You need a method you can copy this afternoon.",
          "Stay until you can make one piece without opening the notes. Then you are allowed another school.",
        ],
      },
      {
        type: "list",
        items: [
          "If two schools both work, pick the quieter one. Loud is usually selling.",
          "If you cannot point at three finished pieces from that school, it is not a school yet.",
          "If you are collecting teachers, you are stalling.",
        ],
      },
      {
        type: "pull",
        text: "One school, one piece, finished. That is the whole test.",
      },
      {
        type: "watch",
        text: "Switching schools every week is not curiosity. It is a way to never be bad at something in public.",
      },
    ],
  },
  {
    slug: "motion-that-doesnt-sicken",
    title: "Motion that does not make people sick",
    kind: "guide",
    summary: "Keep the page usable when nothing moves, and kind when it does.",
    minutes: 8,
    status: "ready",
    when: "You are about to add motion, or someone already said the page made them feel off.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "Some motion looks expensive and costs the reader their stomach. You will not notice if you are the one who built it. They will leave.",
      },
      { type: "h", text: "The cheap way to hurt people" },
      {
        type: "list",
        items: [
          "Parallax on the whole page, especially with the scrollbar.",
          "Large loops that never rest, next to text they are trying to read.",
          "Zooming, spinning, or sliding the viewport itself.",
          "Autoplaying video with movement in the frame, no controls, no pause.",
        ],
      },
      { type: "h", text: "What to do instead" },
      {
        type: "steps",
        items: [
          "Write the page so it works with motion off. That version is the real page.",
          "Add one move, small, on one thing. Opacity and a few pixels beat a journey.",
          "Respect prefers-reduced-motion by not running the move at all. Not a weaker copy of it.",
          "Look at it on a phone, in the hand, for a full scroll. If you feel it in your eyes, cut it.",
        ],
      },
      { type: "h", text: "A useful test" },
      {
        type: "p",
        text: "Turn the motion off. Can a visitor still tell what the page is, where to go, and what just happened? If not, the motion was doing the explaining, which means the page was not finished.",
      },
      {
        type: "pull",
        text: "Stillness is not a lack of craft. It is the default that most people asked for.",
      },
      {
        type: "watch",
        text: "Do not ask a friend who likes your work. Ask someone who gets carsick. Believe them the first time.",
      },
    ],
  },
  {
    slug: "from-nothing",
    title: "From nothing to actually using it",
    kind: "guide",
    summary: "The first week, if you have never used it seriously.",
    minutes: 10,
    status: "ready",
    when: "You have an account open and no idea what to do with it.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Everybody has tried it. Almost nobody has used it. The gap between the two is not knowledge — it is that the first few attempts were against toy problems, went fine, and taught nothing you could carry to real work.",
      },
      { type: "h", text: "Day one: replace one thing you already do" },
      {
        type: "p",
        text: "Not a new capability. Something on your list this week that you already know how to do and do not enjoy. Writing the follow-up email, summarising the call, turning the messy notes into a page. You know what good looks like for these, which means you can judge the output instantly, which is the whole point.",
      },
      { type: "h", text: "Day two: give it your material" },
      {
        type: "p",
        text: "Do the same task again, but this time paste in three examples of how you have done it before. The difference is usually larger than any change of model or prompt technique will get you. You are not asking it to be good at the task; you are asking it to be good at the task the way you do it.",
      },
      { type: "h", text: "Day three: ask for the plan first" },
      {
        type: "p",
        text: "For anything with more than one step, ask what it intends to do before it does it. Read the plan properly. Roughly half the time there is a wrong assumption sitting in step two, and correcting it there costs one sentence instead of a rewrite.",
      },
      { type: "h", text: "Day four: make it argue with you" },
      {
        type: "p",
        text: "Give it something you have already decided and ask it to make the strongest case against it. Not for reassurance — for the two objections you had not thought of. This is the use that most people never try and that most changes how you think about the thing.",
      },
      { type: "h", text: "Day five: write the file" },
      {
        type: "p",
        text: "By now you have repeated yourself several times. Write those repetitions down in one place. Tomorrow, paste that file at the top of everything. That is the whole trick, and there is not a more advanced version of it waiting further along.",
      },
      {
        type: "watch",
        text: "The failure mode of week one is going wide: trying twenty things once each. Go narrow. One task, five days, getting better.",
      },
      {
        type: "pull",
        text: "You are not learning a tool. You are building up a description of how you work that happens to be machine readable.",
      },
    ],
  },
  {
    slug: "the-brief",
    title: "How to brief a model so it gets it right the first time",
    kind: "guide",
    summary: "Six lines that remove most of the back and forth.",
    minutes: 9,
    status: "ready",
    when: "Every time you are about to ask for something that matters.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "A brief is not a longer prompt. It is a short document that removes the model's need to guess. Six lines, most of the time, and it takes about ninety seconds to write.",
      },
      { type: "h", text: "The six lines" },
      {
        type: "steps",
        items: [
          "What it is. One sentence. A landing page, a reply to this email, a function that does X.",
          "Who it is for, and what they already know. The single biggest lever on tone and on how much gets explained.",
          "What it must contain. The facts, the constraints, the things that cannot be left out.",
          "What it must not do. Longer than you think. Every AI tell you hate goes here, permanently.",
          "The shape. How long, what format, how many sections. Ask for a length and you get a length; leave it out and you get five hundred words of everything.",
          "How I will know it worked. The test. If you cannot write this line, do not send the message yet.",
        ],
      },
      { type: "h", text: "The line most people leave out" },
      {
        type: "p",
        text: "Number four. Almost nobody writes down what they do not want, and then they spend six messages removing it one instance at a time. Write it once, keep it forever, paste it every time: no dash in every other sentence, no \"it's not just X, it's Y\", no summary paragraph at the end, no asking me if I want it in a table.",
      },
      { type: "h", text: "A brief you can copy" },
      {
        type: "code",
        label: "brief.txt",
        text: `WHAT: a 400-word page introducing [thing] on my site.
FOR: someone who found it from a link and has thirty seconds.
MUST INCLUDE: [fact], [fact], [the one link].
MUST NOT: sell, use marketing language, or end on a summary.
SHAPE: three short sections, a heading each, no lists.
DONE WHEN: I can read it out loud without wincing.`,
      },
      { type: "h", text: "Then stop briefing" },
      {
        type: "p",
        text: "Once the brief is agreed, do not keep adding to it mid-flight. Corrections belong to the work, not to the brief — otherwise you end up with a document nobody can hold in their head, including the model.",
      },
      {
        type: "watch",
        text: "A brief longer than a page is usually two tasks wearing one coat. Split it.",
      },
    ],
  },
  {
    slug: "ai-for-code-without-being-a-developer",
    title: "AI for code when you are not a developer",
    kind: "guide",
    summary: "Building real software without pretending to know what you do not.",
    minutes: 12,
    status: "ready",
    when: "You can describe what you want but not write it.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "You can now build things you could not build. That is genuinely new and it is not hype. What has not changed is that somebody has to be responsible for whether the thing is any good, and if you are the only person in the room, that is you.",
      },
      { type: "h", text: "What you actually have to learn" },
      {
        type: "p",
        text: "Not a language. Four ideas, and you can learn each of them in an afternoon by having them explained against your own project rather than in the abstract.",
      },
      {
        type: "list",
        items: [
          "Where things live. Which file is the page you are looking at, and which folder holds what. Ask for a tour of your own project and have it name the five files that matter.",
          "How to run it. One command that starts it on your machine, one that checks it still builds. Learn those two and nothing else.",
          "How to undo. Version control, at exactly the depth of: save a checkpoint, go back to the last checkpoint. That is the whole safety net.",
          "How to read an error. Not fix it — read it. Which file, which line, what it says it expected.",
        ],
      },
      { type: "h", text: "The working loop" },
      {
        type: "steps",
        items: [
          "Describe one change, small enough that you could check it by looking at the screen.",
          "Have it made.",
          "Look at the screen. Not at the explanation of what was done — at the actual thing.",
          "If it is right, save a checkpoint. If it is wrong, say precisely what you see that is wrong, and if the second attempt is also wrong, go back to the checkpoint rather than piling on.",
        ],
      },
      {
        type: "pull",
        text: "Two failed attempts at the same fix means the problem is not where you think it is. Reset and describe it again from scratch.",
      },
      { type: "h", text: "The part people get wrong" },
      {
        type: "p",
        text: "They accept code they cannot read at all, and they accept a lot of it at once. Both are the same mistake with different names. Ask for the change to be explained in plain English before you keep it, and keep the changes small enough that the explanation is short. You do not need to be able to write it. You do need to be able to say what it does.",
      },
      {
        type: "watch",
        text: "Anything touching money, personal data or somebody else's account is where you stop and get a person who does this for a living to look. That is not a limit of the tools; it is what you would do with a contractor too.",
      },
    ],
  },
  {
    slug: "one-page-in-a-day",
    title: "Shipping a real page in a day",
    kind: "guide",
    summary: "Empty folder to live URL, in order.",
    minutes: 12,
    status: "ready",
    when: "You have a page to build and one day to build it.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "This is the sequence, in order, with the timings that hold up in practice. It assumes a single page with real content, which is the most common thing anybody actually needs.",
      },
      { type: "h", text: "Morning: decide, do not build" },
      {
        type: "steps",
        items: [
          "Write the brief for the page. What it is, who lands on it, what they do next, what it must not be.",
          "Write the feeling curve: five or six beats, one line each, describing what somebody feels as they scroll. Curiosity, recognition, a quiet bit, the peak, trust, resolve.",
          "Name one signature move — the single thing this page does that no other page does. One. A page with four signature moves has none.",
          "Write the copy. All of it, in a plain document, before any layout exists. Copy written into a layout is copy shaped to fit a box.",
        ],
      },
      {
        type: "pull",
        text: "Half the day goes on decisions. That is the correct proportion, and the reason the build half goes quickly.",
      },
      { type: "h", text: "Afternoon: build in sections" },
      {
        type: "p",
        text: "One section at a time, top to bottom, each finished before the next starts. Structure first, then type, then space, then the move. Colour and animation last, always — they are the easiest things to use to avoid deciding whether the layout is right.",
      },
      { type: "h", text: "The last hour" },
      {
        type: "list",
        items: [
          "Look at it on a phone. Actually on a phone, not at a narrow window.",
          "Turn on reduced motion and look again. Everything must still make sense with nothing moving.",
          "Read every word out loud. This is where the writing that sounded fine goes.",
          "Check the title, the description and the sharing image. They are the only part most people will ever see.",
        ],
      },
      {
        type: "watch",
        text: "The day fails in the same place every time: an hour lost to an animation in the morning. Animation is the last thing, not the fun thing you do first.",
      },
    ],
  },
  {
    slug: "when-it-goes-wrong",
    title: "What to do when it goes wrong",
    kind: "guide",
    summary: "The loop, the drift, and the reset.",
    minutes: 8,
    status: "ready",
    when: "The third time the same fix has not worked.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Things go wrong in three recognisable ways. Once you can name which one is happening, the response is obvious. Most wasted afternoons are spent applying the response to the wrong one.",
      },
      { type: "h", text: "The loop" },
      {
        type: "p",
        text: "You ask for a fix. It is applied. The problem is still there. You say so. A different fix is applied. The problem is still there. Nothing is getting closer.",
      },
      {
        type: "p",
        text: "This means the diagnosis is wrong, and no number of further attempts will find that out. Stop asking for fixes and ask instead for the three most likely causes, ranked, with a way to tell which one it is. Then check, and only then fix.",
      },
      { type: "h", text: "The drift" },
      {
        type: "p",
        text: "It was going well an hour ago and now the answers are subtly worse: things you already settled come back, the tone slips, the instructions from earlier are half remembered. The conversation has too much in it, and the important parts are buried.",
      },
      {
        type: "p",
        text: "Ask for a summary of where things stand, check it, and start a fresh conversation with that summary plus your setup file. This costs two minutes and recovers the whole session.",
      },
      { type: "h", text: "The confident wrong answer" },
      {
        type: "p",
        text: "The most expensive one, because it does not look like a failure. Something is asserted with complete assurance and it is simply not true — an option that does not exist, a function that was never there.",
      },
      {
        type: "list",
        items: [
          "Anything named — a setting, a library, a menu item — gets verified before you rely on it.",
          "Anything numeric gets checked at the source. Numbers are where confidence and accuracy come apart most often.",
          "If it cannot show you where something is, treat it as not being there.",
        ],
      },
      {
        type: "pull",
        text: "Trust the reasoning. Verify the nouns.",
      },
    ],
  },
  {
    slug: "keeping-the-work-yours",
    title: "Keeping the work yours",
    kind: "guide",
    summary: "How to use all this and still sound like yourself.",
    minutes: 7,
    status: "ready",
    when: "When you notice your output has started sounding like everybody else's.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "There is a default voice that comes out of all of this, and it is recognisable now: fluent, tidy, faintly enthusiastic, structurally identical every time. It is not bad writing. It is nobody's writing, and readers have got fast at spotting it.",
      },
      { type: "h", text: "Where it comes from" },
      {
        type: "p",
        text: "It comes from asking for a thing rather than for your thing. If the brief says \"write an about page\", the only voice available is the average of every about page. If the brief carries three examples of how you write, it has somewhere else to go.",
      },
      { type: "h", text: "The tells worth banning outright" },
      {
        type: "list",
        items: [
          "The two-part contrast: \"it is not just X, it is Y\". Once you see it you cannot unsee it.",
          "Tricolon everywhere: three adjectives, three clauses, three items, endlessly.",
          "The summary paragraph that repeats what was just said, introduced by \"ultimately\" or \"in short\".",
          "Words nobody says out loud: delve, leverage, seamless, robust, elevate, unlock.",
          "Ending on a rhetorical question. Nobody has ever been persuaded by one.",
        ],
      },
      { type: "h", text: "The test that actually works" },
      {
        type: "p",
        text: "Read it out loud. Every sentence you would not say to somebody's face gets cut or rewritten. This catches more than any list of rules, because the failure is almost always rhythmic rather than lexical — sentences all the same length, all the same shape, no interruptions.",
      },
      { type: "h", text: "What to keep doing yourself" },
      {
        type: "p",
        text: "The first sentence, the last sentence, the opinion, and anything you would be embarrassed to be wrong about. Those four carry most of what makes something sound like a person. The rest can be drafted and then bent back into shape.",
      },
      {
        type: "watch",
        text: "If you would not put your name on it as it stands, do not publish it and tell yourself you will fix it later. That is how the voice goes.",
      },
    ],
  },
];
