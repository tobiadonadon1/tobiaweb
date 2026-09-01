---
name: ship-check
description: Use this in the last hour before something goes live. Report findings, do not silently fix. Eight-point pass: phone, reduced motion, keyboard, contrast, images, metadata, links, copy. Do not use as a substitute for a full click-through (tester) or for writing the spec.
---

# Ship check

Everybody has a mental checklist and everybody skips it at six in the evening. This is that list, written down, so it still happens when you are tired.

Report findings. Do not fix anything unless you are asked. A skill that fixes as it goes will quietly change four things you did on purpose.

## Check, in this order

Say PASS or the specific problem.

1. Phone. Does anything scroll sideways? Is any tap target under 44px?
2. Reduced motion. With animation off, does every section still make sense, and is all content still reachable?
3. Keyboard. Can I reach every link and control, and is focus visible?
4. Contrast. Any text under 4.5:1 against its actual background.
5. Images. Alt text that describes, not that names the file. Sizes set so nothing jumps as it loads.
6. Metadata. Title, description, canonical, sharing image. Would the link look right pasted into a message?
7. Links. Any that go nowhere, or that open a new tab without saying so.
8. Copy. Read every visible word. Flag anything that sounds generated, any invented number, any em dash used as decoration.

End with the single most important thing to fix, and nothing else.

## When this is not the skill

- A first look at a new build (tester). Ship-check is late and narrow.
- Product decisions (the-spec).
- Visual school (atelier) or motion language (motion-scale), except where they fail a check above.

## Test

If the report is longer than the eight points plus one closer, you wandered into tester. Split it.
