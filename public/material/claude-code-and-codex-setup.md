# Claude Code and Codex — the setup sheet

Everything from the first two guides on one page. Keep it open for the first week.
Commands taken from the official docs (code.claude.com/docs/en/setup and
learn.chatgpt.com/docs/codex/cli) — if one stops working, the docs are the source
of truth, not this sheet.

Free plans do not include Claude Code. You need Pro, Max, Team, Enterprise, or an
API account.

---

## Install

### Claude Code

    macOS / Linux / WSL   curl -fsSL https://claude.ai/install.sh | bash
    Windows PowerShell    irm https://claude.ai/install.ps1 | iex
    Homebrew              brew install --cask claude-code

Check it:

    claude --version      prints a version number
    claude doctor         prints what is wrong, if anything

### Codex

    macOS / Linux         curl -fsSL https://chatgpt.com/codex/install.sh | sh
    npm                   npm install -g @openai/codex

### Sign in

    cd <your project folder>
    claude                opens a browser, sign in, come back
    codex                 same, with your ChatGPT account

No terminal? The Claude desktop app has Claude Code built in. Everything below
works the same; only where you type it changes.

---

## The first three things to type

1. "Tell me about this project."  — never ask for a change before it has read
   the place. The answer also tells you how well it understands what it sees.
2. "/init"  — writes a file describing your project so it stops guessing next
   time. Read what it writes and correct anything wrong.
3. One small real change, small enough that you can check it by looking.

---

## Commands worth knowing on day one

    /init      write the project file the agent reads before anything else
    /model     choose the model and how hard it thinks
    /clear     start a fresh conversation — the most underused command there is
    Escape     stop it mid-answer the moment it is going the wrong way

Claude Code: Shift-Tab enters plan mode. Codex: raise reasoning effort in /model.
For anything bigger than a typo, get the plan before the work. About half the
time there is a wrong assumption in step two, and fixing it there costs one
sentence instead of a rewrite.

---

## Permissions

Both ask before running commands or editing files. Leave that on until you can
read what it is about to do and know whether you want it. The prompt is the only
place you get to say no.

Stop and get a professional to look at anything touching money, live customer
data, or somebody else's account.

---

## The four questions, every time

Before you keep a change you could not have written yourself:

1. How many files changed, and does that match the size of what I asked for?
2. Was anything deleted that I did not ask to have deleted?
3. Is there anything here I could not explain in one sentence?
4. Does the thing on the screen actually do what I wanted?

A one-line request that touched eleven files is the most reliable warning sign
there is.

---

## When it goes wrong

**Two failed attempts at the same fix** — the diagnosis is wrong, and a third
attempt will not find that out. Ask for the three most likely causes, ranked,
with a way to tell which one it is. Then check, then fix.

**Going well an hour ago, subtly worse now** — the conversation has too much in
it. Ask for a summary of where things stand, check it, /clear, and start again
with the summary. Two minutes, and it recovers the whole session.

**Confidently wrong** — anything named (a setting, a library, a menu item) gets
verified before you rely on it. If it cannot show you where something is, treat
it as not being there.

---

## Visual Studio Code, in four parts

    Sidebar (left)        every file in the project
    Editor (middle)       the file you are looking at
    Panel (bottom)        the terminal — run claude or codex here
    Source Control (3rd icon down the left edge)   what actually changed

Four shortcuts and no more:

    Cmd-P / Ctrl-P        jump to any file by name
    Cmd-Shift-F           search every file at once
    Ctrl-`                show or hide the terminal
    Cmd-S                 save

Read the diff in Source Control after every change the agent makes. Green is
added, red is removed. Right-click a file and discard changes to put it back.

Read the diff, not the explanation of the diff.

---

tobiadonadon.com/projects/superhuman/material
