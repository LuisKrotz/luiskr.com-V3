---
name: perf-measure-protocol
description: Measure-first performance protocol — how to detect and quantify gaps (Lighthouse, traces, scroll-fps) without changing behavior. Every perf change must be backed by a measured delta, never by intuition.
---

# Performance Measurement Protocol

Performance work on this site has a history of well-intentioned changes that regressed runtime behavior. **Rule zero: never ship a perf change you cannot measure.** No speculative optimizations, no "should be faster" reasoning — a baseline number must exist before the edit, and a verified delta after it.

## Baseline numbers that matter

- **Lighthouse CI** — `yarn lhci autorun` (or `yarn build --verify-lighthouse` for the full pipeline). Category gates in `lighthouserc.cjs`: accessibility/best-practices/seo error at 1.0, performance warn at 0.95.
- **Scroll FPS** — `node shared/scripts/verify/scroll-fps.mjs` measures real-gesture frame times against preview. Target: 60 FPS, p95 frame time ≤ 33.3 ms.
- **Trace analysis** — capture with `page.tracing` (puppeteer) during a synthetic scroll, then bucket main-thread events (`FunctionCall`, `UpdateLayoutTree`, `Paint`, `EvaluateScript`, `ParseHTML`, `MinorGC`) inside the gesture window. Long tasks >50 ms and any task >30 ms mid-gesture are suspects.
- **Forced reflow** — Lighthouse "Forced reflow" insight names the call sites. Reproduce with a trace: look for `UpdateLayoutTree` immediately following a DOM write on the same frame.

## Gap detection checklist (from real production findings)

1. **Connected/disconnected callback storms** — hundreds of custom-element reactions mid-scroll mean a parent subtree re-render or node moves. Tag elements, log `connectedCallback`/`disconnectedCallback` timestamps inside the gesture window, find the enclosing scheduler (timer, promise, rIC).
2. **rIC/idle callbacks landing mid-gesture** — under CPU throttle, idle grants fire during scroll pauses. Anything scheduled on `requestIdleCallback` (route warmers, prefetch, wasm eval) can evaluate inside the gesture. Bucket idle callbacks by start time; flag any overlapping scroll.
3. **ResizeObserver/content-visibility unskip thrash** — `content-visibility: auto` unskipping fires RO callbacks mid-scroll; RO handlers that measure+write (`flushFits`-style) cause read-write ping-pong. Check every RO consumer for a measure→write pattern.
4. **Prefetch resolving mid-gesture** — a fetch started before scroll resolving mid-scroll → store commit → re-render. Correlate network completions with re-render storms.
5. **ParseHTML mid-scroll** — `innerHTML`, `DOMParser`, or template insertion during gesture. Grep for `innerHTML|insertAdjacentHTML|DOMParser` on scroll-adjacent paths.
6. **Module eval mid-scroll** — dynamic `import()` resolving inside the gesture runs `customElements.define` upgrades or chunk init. Tag `EvaluateScript` events by URL and time.

## Process

1. Reproduce under realistic throttle (4× CPU, slow network for load metrics; real device profile for scroll).
2. Bucket the trace; identify the top offender **by name and source location** before touching code.
3. Fix the scheduling or the read/write ordering — never delete functionality to win a number.
4. Re-measure the identical scenario; record before/after.
5. `yarn verify` + focused Jest (`--bail`) must stay green; coverage tails required for any new conditional arm — the 100% per-file gate applies to perf code too.

## Reversal criteria

If the measured delta is within noise (<10% or overlapping p95 ranges) or introduces any behavioral regression, revert. A perf change that survives is one where the trace proves the offending work moved or disappeared — not one where the code "looks better".
