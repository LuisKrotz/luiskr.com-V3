---
name: perf-main-thread-layout
description: Main-thread and layout performance — eliminating forced reflows and layout thrash, keeping tasks under budget, IntersectionObserver-first visibility, composited-only animations, and CLS discipline.
---

# Main-Thread & Layout Performance

The frame budget is 16 ms (8 ms on a busy thread, ~33 ms p95 during fling). Everything that reads or writes layout must respect read/write ordering and scheduling.

## Forced reflow — the core rule

A forced reflow happens when JS reads geometry (`offsetWidth`, `getBoundingClientRect`, `clientHeight`, `scrollTop`, `getComputedStyle`) **after** styles have been invalidated in the same task — the browser must synchronously flush layout.

- **Batch by phase**: all reads first, then all writes. Never `write → read → write` in one task.
- Production evidence: the entry chunk spends ~84 ms on reflow from a single call site — one `write→read` pair in a hot path costs more than a thousand safe calls.
- `ResizeObserver` callbacks that measure then write (fit/measure ladders, e.g. draw-text `flushFits`) are the classic offender: RO fires mid-scroll on `content-visibility` unskip → measure → write → invalidate → next sibling measures → reflow again. Queue all writes to the end of the callback or to a `requestAnimationFrame` flush.
- `content-visibility: auto` + RO = deferred measurement storms. If a measurement can be deferred to scroll-settle, defer it.

## Long tasks

- Tasks >50 ms block input; >30 ms mid-gesture shows as jank. Break serial work with `scheduler.yield()` / rIC, move batch math to `wasm-pool`.
- Idle-scheduled chains (route warmers, prefetch, chunk eval) must check scroll state before each step — an idle grant under CPU throttle lands mid-gesture.

## IntersectionObserver first

- Visibility decisions belong in `IntersectionObserver` (polyfill `core/legacy-polyfills/io.ts`) — it's free compared to scroll handlers + `getBoundingClientRect` loops.
- Scroll listeners coalesce through `requestAnimationFrame` (already the convention) and must stay passive. Never add a non-passive `scroll`/`touchmove`/`wheel` listener.
- One IO per purpose; reuse observers where possible rather than spawning per-element instances.

## Animations — composited only

- Animate `transform` and `opacity` only. `background-position`, `width`, `height`, `top`/`left` animations run on the main thread and defeat compositing — Lighthouse flags them (`Unsupported CSS property: background-position-x` on the intro loader is a live example).
- `will-change` sparingly — every layer costs memory; promote only during the animation, demote after.
- Per-frame canvas/WebGL math lives on GPU or in sync local math — never `await` per frame (AGENTS.md rule 20).

## CLS discipline

- Reserve space before content: explicit `aspect-ratio`, width/height, or skeleton placeholders (the skeleton system exists — use it).
- The intro loader's shifts are tolerated by design (splash); everything after interface-ready must score ~0. Never inject layout-affecting content above the fold post-hydration.

## What NOT to do

- Do not remove functionality, observers, or content to win metrics.
- Do not convert IO/RO to scroll handlers "for precision" — they are strictly more expensive.
- Do not batch reads/writes across component boundaries without checking ownership — component self-containment (portability) still applies.
