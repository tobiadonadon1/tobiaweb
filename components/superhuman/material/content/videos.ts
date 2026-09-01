import type { MaterialEntry } from "../material-types";

/**
 * SHORT VIDEOS — written first, filmed second.
 *
 * NOTHING IN HERE PRETENDS TO BE WATCHABLE. Every entry carries
 * `status: "filming"`, which the index draws differently and the reading pane
 * says out loud. What each one does carry is the notes the video will be cut
 * from, which are useful on their own — you can follow a numbered list of
 * moves without watching anybody do them.
 *
 * When a video is recorded, its entry gets a `link` and its status becomes
 * `ready`. That is the only change needed; the page follows.
 *
 * TODO(tobia): these are the six I would film first. Reorder or replace them
 * with the ones you actually want to sit down and record.
 */
export const VIDEOS: MaterialEntry[] = [
  {
    slug: "writing-a-brief",
    title: "Writing a brief, in front of you",
    kind: "video",
    summary: "A vague request made buildable, in real time.",
    minutes: 4,
    status: "filming",
    when: "You have read the brief guide and want to see one written.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Screen recording. A one-line request at the start, a working brief at the end, and every question I ask myself in between said out loud.",
      },
      { type: "h", text: "What it shows" },
      {
        type: "steps",
        items: [
          "The request as it arrives: four words and an assumption.",
          "The six lines, filled in one at a time, including the two I get wrong first.",
          "The must-not list, which is the longest part and the one nobody writes.",
          "The done-when line, and what happens when I cannot write it — the task gets smaller until I can.",
        ],
      },
      {
        type: "p",
        text: "The paired writing is in Guides, under How to brief a model so it gets it right the first time. The video adds the hesitation, which is the part the written version cannot show.",
      },
    ],
  },
  {
    slug: "one-section-start-to-finish",
    title: "One section, start to finish",
    kind: "video",
    summary: "Blank file to finished section, uncut.",
    minutes: 6,
    status: "filming",
    when: "You want to see the actual working rhythm rather than a result.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "The whole loop at normal speed: structure, then type, then space, then the one move. No time lapse, because the pauses are the content.",
      },
      { type: "h", text: "What it shows" },
      {
        type: "list",
        items: [
          "Why the first version is deliberately ugly and unstyled.",
          "Where I stop and look at the screen instead of reading the explanation.",
          "The correction, said precisely, once.",
          "Colour and animation arriving last, which is the part most people do first.",
        ],
      },
    ],
  },
  {
    slug: "a-bad-answer-into-a-good-one",
    title: "Turning a bad answer into a good one",
    kind: "video",
    summary: "One request, four corrections, what each changes.",
    minutes: 5,
    status: "filming",
    when: "Your first answers are close but never right.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "One deliberately weak first answer, on screen, and then the four corrections that fix it — each one shown separately so you can see what it did on its own.",
      },
      { type: "h", text: "The four corrections" },
      {
        type: "steps",
        items: [
          "Give it the material it was missing.",
          "Name the reader.",
          "Say what it must not do.",
          "Ask for the specific thing that is wrong, rather than for it to be better.",
        ],
      },
      {
        type: "watch",
        text: "The interesting part is that three of the four are things you could have said at the start. The video is really about the brief.",
      },
    ],
  },
  {
    slug: "a-skill-from-scratch",
    title: "Building a skill from scratch",
    kind: "video",
    summary: "Spotting a repetition and turning it into a file.",
    minutes: 6,
    status: "filming",
    when: "You have read the Skills folder and want to write your own.",
    level: "Some code",
    body: [
      {
        type: "p",
        text: "Start from a real annoyance — something I had said twice that week — and end with a file that means I never say it again.",
      },
      { type: "h", text: "What it shows" },
      {
        type: "steps",
        items: [
          "How to spot the repetition. It is rarely the thing you would have guessed.",
          "Writing the rules, then testing them against a real task straight away.",
          "The first version failing, and why it fails: rules without examples.",
          "Adding the examples, and the difference that makes on the same input.",
        ],
      },
    ],
  },
  {
    slug: "reading-a-diff",
    title: "Reading a change you did not write",
    kind: "video",
    summary: "Checking changes you could not have written.",
    minutes: 5,
    status: "filming",
    when: "You are accepting changes you do not fully understand.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "A practical method for reviewing work you could not have produced. Not about becoming a developer — about knowing which four questions to ask of any change.",
      },
      { type: "h", text: "The four questions" },
      {
        type: "steps",
        items: [
          "How many files changed, and does that number match the size of what I asked for?",
          "Was anything deleted that I did not ask to have deleted?",
          "Is there anything here I could not explain to somebody in one sentence?",
          "Does the thing on the screen actually do what I wanted?",
        ],
      },
      {
        type: "pull",
        text: "A one-line request that touched eleven files is the single most reliable warning sign there is.",
      },
    ],
  },
  {
    slug: "the-reset",
    title: "The reset: when to throw the conversation away",
    kind: "video",
    summary: "Telling drift from a hard problem.",
    minutes: 3,
    status: "filming",
    when: "It was going well an hour ago and now it is not.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "The shortest one. Three signs that a conversation has gone stale, and the two-minute move that recovers the session instead of the afternoon.",
      },
      { type: "h", text: "What it shows" },
      {
        type: "list",
        items: [
          "The three signs: settled things coming back, tone slipping, instructions half remembered.",
          "Asking for a summary of where things stand, and checking it rather than trusting it.",
          "Starting again with that summary plus the setup file, and how quickly it picks back up.",
        ],
      },
    ],
  },
];
