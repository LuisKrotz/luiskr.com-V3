---
name: perf-animation-frame
description: Animation frame-budget engineering — 120Hz mobile / 240Hz desktop ceilings, zero-allocation frame loops, coalesced high-rate input, passive listeners, pooled objects, and the animation-frame-budget governance gate. CMS is exempt.
---

# Animation Frame Budget — 120Hz mobile / 240Hz desktop

Every animation and frame path must keep its synchronous work under the budget tokens in `core/tokens/motion/frame-budget.ts`: `FRAME_BUDGET.MOBILE_MS` (≈8.33ms, ≥120Hz mobile) and `FRAME_BUDGET.DESKTOP_MS` (≈4.16ms, ≥240Hz desktop). The render pipeline goal is JavaScript/CSS that skips Layout and Paint and goes straight to Composite.

Enforced by `shared/tests/governance/animation-frame-budget.test.js` — scans `shared/src`, `core`, `website`, `experiments` (CMS exempt):

- Scroll-blocking listeners (`pointermove`, `mousemove`, `wheel`, `touchmove`, `touchstart`, `scroll`) MUST register `{ passive: true }`.
- Any file binding `pointermove` MUST consume `event.getCoalescedEvents()` — 1000–8000Hz mice deliver several events per frame; process only the samples you need (usually the last for hover/velocity).
- Every rAF callback's synchronous execution is timed while all components/views mount — anything over `FRAME_BUDGET.DESKTOP_MS` fails.

## Frame-loop rules

- **Zero allocation per frame**: no objects, arrays, closures, or template strings inside rAF ticks and per-event input handlers. Preallocate scalars/fields, pool objects (raycasters, NDC vectors, event scratch), prefer `Float32Array`/`Int32Array` SoA layouts for bulk state.
- **V8 stability**: frame-critical functions stay monomorphic (same arity/types every call) so TurboFan inlines them; no `delete`, no rest/`arguments` in hot paths, `x | 0` for fast int coercion.
- **Reads vs writes**: rAF writes visual state; layout reads go through the cached-viewport helpers or a post-write read phase — never interleave (also gated by `no-forced-reflow.test.js` and `flushLayout()`).
- **Rect/metric caching**: capture `getBoundingClientRect` once per gesture/frame — never per pointer event.
- **Termination**: frame loops must self-stop when hidden/idle (IntersectionObserver, `document.hidden`, pref checks) and be cancelable on destroy.

## Input rules

- High-rate handlers record scalars and schedule ONE rAF tick per frame; the heavy work (raycast, physics) runs there.
- `getCoalescedEvents()` on pointermove; last sample for position, full array only when intermediate points matter (drawing, trails).
- Wheel/touchmove/touchstart/scroll/pointermove always `{ passive: true }` — a non-passive listener forces the compositor to wait.

## Offload & graphics

- Per-frame GPU work lives in shaders/instancing (Bind Groups, instanced draws) — never re-upload geometry per frame; uniforms only.
- Batch CPU >1ms routes through `core/utils/wasm/wasm-pool.ts` (see `perf-compute-offload`); `SharedArrayBuffer` + typed views for shared state — no `DataView` in hot paths.
- Canvas 2D hot paths: `desynchronized: true`, `alpha: false`, and manual double-buffer via offscreen canvas + `drawImage` bit-blit when needed.
- Visibility first: IntersectionObserver gates animation work; `requestIdleCallback`/`scheduler.postTask` for warm-up; critical tick functions get warmed (executed once on dummy data during load) so TurboFan is hot before first interaction.

## Related

- `perf-compute-offload` — WASM pool / workers / GPU tiers.
- `perf-main-thread-layout` — layout thrash, IO-first visibility, composited-only animation.
- `perf-measure-protocol` — every perf change needs a measured delta.
- Gate: `shared/tests/governance/animation-frame-budget.test.js`; tokens: `core/tokens/motion/frame-budget.ts`.
