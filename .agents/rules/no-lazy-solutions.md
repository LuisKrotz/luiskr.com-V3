# Rule: No Lazy Solutions — Never Take Shortcuts

Deliver the fully-realized form of every request. Never ship the cheap
stand-in:

- A requested icon set means **distinct designed glyphs per type** — not
  one generic shape with a text label stamped on it.
- A requested interaction means the **real widget/behavior used
  elsewhere in the project** — not a minimal approximation.
- A requested visual state means **authored artwork for every state**
  — not a single static form.
- "Amount" readouts are **visual** (stacked papers, filled bars) — not
  a bare numeral badge, unless the user asked for a number.

## Reuse beats invention

The codebase's building blocks ARE the quality bar: canvas widgets
(`CloseButtonWebGL`, theme slider, switch slider), token classes, modal
chrome, motion primitives, the token scales. Reaching for them is the
pattern; writing a weaker one-off substitute is the shortcut.

## When a shortcut is truly forced

Missing dependency, platform limit, time constraint — say so explicitly
and flag the gap. Never pass a stand-in off as finished work.

## Done is the designed result

"Good enough to pass tests" is not done. The result must look, behave,
and read as designed work — to the user, to crawlers, and to assistive
technology.
