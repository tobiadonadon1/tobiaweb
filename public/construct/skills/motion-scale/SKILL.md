---
name: motion-scale
description: Use this when specifying or implementing site motion as a 0-5 language with a reduced-motion twin. GSAP or Motion One. Do not use for graphic-school lock, page copy, or as a GSAP API reference.
---

# Motion scale

Motion is a language with a volume knob, not a pile of effects. Pick one number. Every moving thing on the site obeys it. Every moving thing has a twin that works when the user has asked for less.

## The scale

- 0: Nothing moves except the user's scroll. Instant state changes. Not broken: still has hover contrast and focus.
- 1: Fades only. No travel. About 120ms. No bounce, stagger, or parallax.
- 2: Small travel, 4 to 12px, opacity, one axis. About 200-280ms. Ease out. No choreography across sections.
- 3: Section-level entrance. Stagger of siblings, one at a time. Scroll can trigger once. No continuous ambient motion.
- 4: A signature sequence: one moment the page is known for. Still interruptible. No second signature. No loading theatre.
- 5: Cinematic, rare. Full-page or film-like. Needs a reason stronger than "we can". Almost never the default.

If the user does not name a level, propose one that matches the atelier school and wait. Swiss at 4 is usually a mistake. New Wave at 0 can be a choice.

## Tools

Use GSAP or Motion One. Not both on one surface. Not a third library. Specify behaviour: duration, delay, ease, trigger, what happens if interrupted.

Do not paste plugin catalogues, timeline trivia, or trick lists. If a plugin is required, name it and why in one line.

## Reduced-motion twin

For every motion, write the prefers-reduced-motion: reduce version in the same breath.

The twin must keep:

- The same information (nothing important only exists in flight).
- A clear state change (instant is allowed).
- The signature move as a still, a cut, or a fade, never as "just skip the section".

If you cannot describe the twin, the motion was doing content's job. Cut the motion, not the twin.

## Rules that survive every level

- Transform and opacity only, unless there is a documented exception.
- One signature move on a page (atelier already said this; motion does not get a second).
- User-triggered motion can be richer than ambient motion. Ambient motion is guilty until proven.
- Honour reduced motion as a first-class layout, not an if you might forget.
- If it loops forever in the hero, it is advertising. Level 5, or cut it.

## When this is not the skill

- Choosing a graphic school or type lock (atelier).
- Writing the words (page-copy).
- Debugging a specific GSAP error with no design decision attached.

## Test

Turn reduced motion on. Can you still tell what the page is, and do the thing it asked? Then turn it off and look away for two seconds. Did anything still moving feel like it needed you to watch? If yes, lower the level.
