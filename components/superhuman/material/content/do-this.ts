import type { MaterialEntry } from "../material-types";

/**
 * DO THIS — the three practical ones, in order.
 *
 * This folder used to be three short essays about how to think about working
 * with AI. They were true and nobody needed them: somebody arriving here has
 * not got a philosophy problem, they have an "I do not have it installed"
 * problem. So the folder is three things you actually do, at a keyboard,
 * finishing with a working setup.
 *
 * EVERY COMMAND HERE IS TAKEN FROM THE OFFICIAL DOCUMENTATION, not from
 * memory: code.claude.com/docs/en/setup and learn.chatgpt.com/docs/codex/cli.
 * TODO(tobia): these age. When one breaks, fix it here and both the page and
 * the downloadable sheet follow.
 */
export const DO_THIS: MaterialEntry[] = [
  {
    slug: "install-claude-code-and-codex",
    title: "Install Claude Code and Codex",
    kind: "guide",
    summary: "Both agents, installed and signed in.",
    minutes: 8,
    status: "ready",
    when: "Before anything else in here.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Two coding agents that run on your own machine against your own files. Install both: they cost you nothing to have side by side, and you will end up preferring one for some jobs and the other for others.",
      },
      {
        type: "watch",
        text: "Both need a paid plan. Claude Code needs Pro, Max, Team or Enterprise, or an API account. The free Claude plan does not include it.",
      },

      { type: "h", text: "1. Open a terminal" },
      {
        type: "p",
        text: "On a Mac, press Command and Space, type Terminal, press Return. On Windows, press the Start key, type PowerShell, press Return. A window opens with a blinking cursor. That is the whole thing.",
      },
      {
        type: "shot",
        need: "A fresh Terminal window on macOS, nothing typed in it yet.",
      },

      { type: "h", text: "2. Install Claude Code" },
      {
        type: "p",
        text: "Paste one line and press Return. On macOS, Linux or WSL:",
      },
      {
        type: "code",
        label: "macOS, Linux, WSL",
        text: "curl -fsSL https://claude.ai/install.sh | bash",
      },
      { type: "p", text: "On Windows, in PowerShell:" },
      {
        type: "code",
        label: "Windows PowerShell",
        text: "irm https://claude.ai/install.ps1 | iex",
      },
      {
        type: "p",
        text: "If you already use Homebrew, brew install --cask claude-code does the same job. Check it worked:",
      },
      {
        type: "code",
        text: "claude --version",
      },
      {
        type: "p",
        text: "A version number means you are done. Anything else, run claude doctor, which prints what is wrong and what to do about it.",
      },

      { type: "h", text: "3. Install Codex" },
      {
        type: "code",
        label: "macOS, Linux",
        text: "curl -fsSL https://chatgpt.com/codex/install.sh | sh",
      },
      {
        type: "p",
        text: "Or, if you have Node installed already, npm install -g @openai/codex. Same binary either way.",
      },

      { type: "h", text: "4. Sign in" },
      {
        type: "steps",
        items: [
          "Type cd followed by a space, drag your project folder onto the terminal window, press Return. You are now working in that folder.",
          "Type claude and press Return. A browser opens; sign in; come back to the terminal.",
          "Type codex and press Return. Same again, with your ChatGPT account.",
        ],
      },
      {
        type: "shot",
        need: "The Claude Code sign-in prompt in the terminal, before the browser opens.",
      },
      {
        type: "p",
        text: "Both are now installed for good. Opening either one in future is one word in a terminal.",
      },

      { type: "h", text: "If you would rather not use a terminal" },
      {
        type: "p",
        text: "The Claude desktop app has Claude Code built into it, with the same agent behind a normal window. Nothing in the next guide changes; only where you type it does.",
      },
      {
        type: "pull",
        text: "Install both. Decide which you prefer after a week of using them, not before.",
      },
    ],
    link: {
      label: "Download the setup sheet",
      href: "/material/claude-code-and-codex-setup.md",
      download: true,
    },
  },

  {
    slug: "using-claude-code-and-codex",
    title: "Using Claude Code and Codex",
    kind: "guide",
    summary: "What to type, what to trust, and when to stop.",
    minutes: 14,
    status: "ready",
    when: "The first week of actually using them.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "Both agents work the same way: you describe what you want in ordinary English, they read your files, make changes, and show you what they did. Everything below applies to either one.",
      },

      { type: "h", text: "The first three things to type" },
      {
        type: "steps",
        items: [
          "\"Tell me about this project.\" Never ask for a change before you have made it read the place. The answer also tells you how well it understands what it is looking at.",
          "\"/init\". Both agents write a file describing your project so they stop guessing next time. Read what it writes and correct anything wrong.",
          "One small real change. Something you can check by looking at the screen.",
        ],
      },

      { type: "h", text: "Plan before build" },
      {
        type: "p",
        text: "For anything bigger than a typo, ask what it intends to do before it does it. Read the plan. About half the time there is a wrong assumption sitting in step two, and fixing it there costs one sentence instead of a rewrite.",
      },
      {
        type: "p",
        text: "Claude Code has a plan mode for exactly this, reached by pressing Shift and Tab. Codex has /model, where raising the reasoning effort has much the same result on hard problems.",
      },

      { type: "h", text: "Permissions, and why to leave them on" },
      {
        type: "p",
        text: "Both ask before running commands or editing files. The temptation in week one is to turn that off because it is slower. Do not, until you can read what it is about to do and know whether you want it. The prompt is the only place you get to say no.",
      },
      {
        type: "watch",
        text: "Anything touching money, live customer data or somebody else's account is where you stop and get a person who does this for a living to look.",
      },

      { type: "h", text: "Commands worth knowing on day one" },
      {
        type: "list",
        items: [
          "/init — write the project file both agents read before anything else.",
          "/model — choose the model and how hard it thinks. Raise it for hard problems, lower it for mechanical ones.",
          "/clear — start a fresh conversation. The most underused command there is.",
          "Escape — stop it mid-answer the moment you can see it is going the wrong way. Do not wait politely for it to finish.",
        ],
      },

      { type: "h", text: "Checking work you could not have written" },
      {
        type: "p",
        text: "You do not need to be able to write the code. You do need four questions, every time.",
      },
      {
        type: "steps",
        items: [
          "How many files changed, and does that match the size of what I asked for?",
          "Was anything deleted that I did not ask to have deleted?",
          "Is there anything here I could not explain in one sentence?",
          "Does the thing on the screen actually do what I wanted?",
        ],
      },
      {
        type: "pull",
        text: "A one-line request that touched eleven files is the most reliable warning sign there is.",
      },

      { type: "h", text: "When to stop and start again" },
      {
        type: "p",
        text: "Two failed attempts at the same fix means the diagnosis is wrong, and a third attempt will not find that out. Stop asking for fixes. Ask instead for the three most likely causes, ranked, with a way to tell which one it is.",
      },
      {
        type: "p",
        text: "If it was going well an hour ago and is now subtly worse, the conversation has too much in it. Ask for a summary of where things stand, check it, and /clear. Two minutes, and it recovers the whole session.",
      },
      {
        type: "p",
        text: "The download below is the same material as a single sheet, with the commands and the four questions in one place. Keep it next to you for the first week.",
      },
    ],
    link: {
      label: "Download the setup sheet",
      href: "/material/claude-code-and-codex-setup.md",
      download: true,
    },
  },

  {
    slug: "visual-studio-code",
    title: "Visual Studio Code, from zero",
    kind: "guide",
    summary: "The window your project lives in, explained once.",
    minutes: 12,
    status: "ready",
    when: "As soon as you want to see the files the agent is changing.",
    level: "Anyone",
    body: [
      {
        type: "p",
        text: "An editor is just a window onto a folder of files. Visual Studio Code is the one most people use, it is free, and both agents run inside it. Learn the four parts below and you can stop being a passenger.",
      },
      {
        type: "p",
        text: "Download it from code.visualstudio.com, open it, and open your project folder with File then Open Folder.",
      },
      {
        type: "shot",
        need: "The Visual Studio Code welcome screen, before any folder is open.",
      },

      { type: "h", text: "The four parts of the window" },
      {
        type: "list",
        items: [
          "The sidebar, on the left. Every file in your project. Clicking one opens it. This is the part that makes a project stop feeling like magic.",
          "The editor, in the middle. The file you are looking at. Tabs along the top, exactly like a browser.",
          "The panel, along the bottom. This is where the terminal lives. Open it with Control and backtick, and run claude or codex right there.",
          "The status bar, along the very bottom. Which branch you are on, and whether anything is broken.",
        ],
      },
      {
        type: "shot",
        need: "The full VS Code window with a project open, the four regions visible: sidebar, editor, terminal panel, status bar.",
      },

      { type: "h", text: "Four shortcuts, and no more" },
      {
        type: "list",
        items: [
          "Command-P (Control-P on Windows) — jump to any file by typing part of its name. The one you will use hundreds of times a day.",
          "Command-Shift-F — search every file in the project at once.",
          "Control-backtick — show or hide the terminal.",
          "Command-S — save. Nothing you change is real until you do.",
        ],
      },

      { type: "h", text: "The source control tab, which is the important one" },
      {
        type: "p",
        text: "The third icon down the left-hand edge shows every change since your last save point. When an agent edits your project, this is where you see exactly what it did: file by file, line by line, added in green and removed in red.",
      },
      {
        type: "shot",
        need: "The Source Control panel with a few changed files listed, and one file's diff open beside it showing green and red lines.",
      },
      {
        type: "p",
        text: "This is the single most useful screen in the editor and almost nobody new opens it. Look at it after every change the agent makes. It is also how you undo: right-click a file and discard changes to put it back the way it was.",
      },
      {
        type: "pull",
        text: "Read the diff, not the explanation of the diff.",
      },

      { type: "h", text: "Running the agents inside the editor" },
      {
        type: "p",
        text: "Open the terminal panel and type claude or codex. You get the agent on one side and the files it is changing on the other, updating as it goes. There is also an official extension for each if you prefer a panel to a terminal.",
      },
      {
        type: "watch",
        text: "Extensions can read everything in your project. Install the two official ones and resist the rest until you have a specific reason.",
      },
    ],
    link: {
      label: "code.visualstudio.com",
      href: "https://code.visualstudio.com",
    },
  },
];
