# WebGL / canvas utilities (core/utils/canvas)

Shared GPU widgets used by the public site and playground. Every widget follows
the same contract:

1. **Acquire** a GL context through `webgl-pool.ts` (limited shared pool).
2. **Render** minimal geometry per frame (or on demand).
3. **Fallback** to a CSS/`is-fallback` presentation when GL is unavailable.
4. **Destroy** — release program, buffers, textures, RAF and return the context
   to the pool; `destroy()` is safe on a mocked/partial `gl`.

Widgets live under `canvas/widgets/`, page-load canvases under
`canvas/loaders/` — each is a facade plus a same-named folder of modules.
Shared GL infrastructure stays at `canvas/` root: `gl-program.ts`
(compile/link/quad boilerplate every widget shares), `gl-lifecycle.ts`
(the shared context-loss watcher + `releaseQuadGL` teardown helper),
`css-color.ts`, `webgl-pool.ts`, `webgl-mode.ts` (the authoritative
`webglContext` acquisition — supports `?debug=webGLMode:*`).

| Facade                             | Modules                                                       | Used by                                             | Fallback                   |
| ---------------------------------- | ------------------------------------------------------------- | --------------------------------------------------- | -------------------------- |
| `webgl-pool.ts`                    | —                                                             | everything below                                    | —                          |
| `loaders/menu-background-webgl.ts` | `loaders/menu-background/{init,loop,shaders,theme}`           | AppNav menu backdrop                                | plain backdrop, no canvas  |
| `loaders/skeleton-webgl.ts`        | `loaders/skeleton/{init,loop,measure,renderer,shaders,theme}` | BaseComponent skeleton layer                        | CSS shimmer only           |
| `loaders/intro-loader.ts`          | —                                                             | App bootstrap                                       | text loader                |
| `widgets/burger-button-webgl.ts`   | `widgets/burger-button/shaders`                               | AppNav burger                                       | CSS lines                  |
| `widgets/close-button.ts`          | `widgets/close-button/{init,render,shaders}`                  | AppNav, LangDialog, PreferencesModal, MediaExpanded | `is-fallback` → CSS × mark |
| `widgets/flag-webgl.ts`            | `widgets/flag/{anim,draw,gl,loop,renderer,shaders,texture}`   | AppNav, LangDialog                                  | static flag image          |

`flag/texture.ts` prefers the wasm pool: `decodeImageWASM` fetches the flag
SVG and rasterizes it in a worker via `createImageBitmap` with GPU resize
hints, so the texture uploads a POT-sized `ImageBitmap` directly (no
main-thread decode or 2D-canvas resample). The `<img>` decode stays as the
fallback and the natural-aspect probe.
| `widgets/theme-slider.ts` | `widgets/theme-slider/{events,init,math,paint-2d,render,shaders}` | PreferencesModal | native checkbox |
| `widgets/switch-slider.ts` | `widgets/switch-slider/{init,paint-2d,render,shaders}` | PreferencesModal | native checkbox |
| `widgets/carousel-controls.ts` | `widgets/carousel-controls/paint-2d` | CustomCarousel arrows | CSS arrows |

`earth-background.ts` and `space/checkbox-webgl.ts` are **not** here — they
are playground-owned and live in `experiments/earth-playground/`.

## Lifecycle rules

- Contexts are pooled and reference-counted; a destroyed widget returns its
  slot so the page never accumulates contexts (browsers cap ~16).
- `destroy()` guards every release call (`if (gl && gl.deleteX)`-style) so unit
  tests can inject mock `gl` objects without crashing.
- **Offscreen = destroyed, not paused.** `webgl-pool.ts` observes every
  registered canvas via IntersectionObserver: offscreen widgets get `purge()`
  (RAF cancelled, `releaseQuadGL` force-loses the context) and re-entering
  widgets get `restore()` (context + program rebuilt from scratch). Shared
  renderers (`flag`, `skeleton`) refcount down to zero so the _last_ offscreen
  consumer frees the shared context entirely.
- `restore()` keeps `_purged` set while the canvas is detached or the widget
  doesn't want activation — an early return must never swallow the pending
  rebuild, or the next observer callback would no-op and leave a dead widget.
- `preserveDrawingBuffer` is never enabled (it forces buffer copies); tests
  read animation state from loop flags, not pixel reads.
- Software rasterizers (SwiftShader/llvmpipe/headless) are rejected at
  acquisition — `getGPUInfo().software` — because a CPU-drawn fullscreen
  shader is the crash/stall path the fallback exists to avoid.

## Skeletons

`syncSkeletonLayer(component)` scans the content wrapper for `skeleton-*`
placeholders, measures each rect, and draws the glyph/"decoding" field on an
overlay canvas while the CSS placeholders stay in flow but transparent (they
remain the fallback when WebGL is unavailable). Details:

- Rects are positioned and **clipped against the host's padding box**, so a
  placeholder that overflows its component can never let the overlay paint
  into siblings.
- Computed styles are read once per placeholder and cached (`_styleCache`);
  `sampleTheme()` drops the cache on a theme flip. This avoids a forced
  style resolution per rect per refresh.
- The ResizeObserver set re-syncs to the live placeholder nodes on every
  measure — content rebuilds swap nodes, and zero-sized placeholders get
  tracked once they grow.
- The layer paints one static frame at mount; the animated loop still starts
  on the idle callback so first paint is never blank.
- On `resolve()` the canvas sinks below the incoming content
  (`isolation: isolate` on the host keeps the negative stacking scoped) and
  dissolves while `.skeleton-content-in` fades real markup in — stale
  placeholder geometry never paints over the real layout.

## Context loss

Widgets listen for `webglcontextlost` via `gl-lifecycle.ts`'s
`watchContextLoss`, which never calls `preventDefault()` — a prevented loss
asks the browser to _restore_ the context, so every deliberate
`loseContext()` in `destroy()`/`purge()` would resurrect a zombie context
that exhausts the pool and crashes real surfaces (the menu's former
"crash frequently" bug). `releaseQuadGL` detaches the listener before the
intentional `loseContext()`, deletes buffers/programs, and leaves the lost
context dead — the CSS/`is-fallback` presentation takes over permanently.
Failed shader compiles take the same path: `_triggerFallback` releases any
acquired context, so a hidden canvas never keeps a live slot.

The menu canvas is never detached/re-cloned mid-session; a DOM swap used to
break the AppNav reference (`_menuCloseCanvasEl`) and was removed.

## Menu fallback membrane

When the contour shader can't run (no WebGL, software rasterizer, context
loss, `?debug=webGLMode:fallback`), `.nav-menu-modal-fallback` renders the
same organic-isoline idea in pure CSS: two solid-ink layers clipped by
inline-SVG `feTurbulence` posterization masks (terraced alpha ≙ topographic
bands) drifting at different speeds — not hard geometric rings. The entrance
mirrors the shader's 2600 ms centre-out reveal; `--menu-ink`/`--menu-ink-2`
keep it theme-aware.

## Compute placement — GPU vs wasm vs main thread

Per-frame math (contour fields, widget shaders, three.js scene updates) runs
on the **GPU** — GLSL fragment shaders for the 2D widgets/loaders, WebGPU/TSL
for the Earth engine. That is the GPU acceleration story: every pixel's math
executes in parallel on the graphics device, and moving it to wasm would be a
regression (wasm is CPU SIMD; it cannot beat thousands of shader cores, and an
`await` inside a frame would blow the frame budget).

Batch CPU work that is _not_ per-frame routes through the wasm worker pool
(`core/utils/wasm/wasm-pool.ts` → `public/workers/wasm-worker.js`, lazily
spawned, 2 workers on mobile / 4 on desktop): mosaic batch layout,
spring-physics integration, draw-text timing, media hashing, GPU-hardware
image decode (`createImageBitmap` with decode-time resize — including flag
SVGs for the nav/lang widgets), media URL decode/probe/prefetch and ranged
video-segment fetches. Every dispatch
resolves `null` on failure so callers degrade to the local JS path — the
worker-side `wasmInstance` checks do the same inside each kernel, so the site
works identically with or without `engine.wasm`.

Small synchronous math (uniform interpolation, easing, hit tests) stays inline
in JS — below a certain size the JIT matches wasm and the call overhead isn't
worth it.

## Diagnostics — zero-console

No `console.*` calls anywhere in the source areas (`src|core|website|cms|
experiments`, AGENTS.md rule 12). WebGL init
warnings, shader-compile failures, context-loss notices and error paths all
write to `core/devlog.ts` — a capped ring buffer (`DEV_LOG.MAX_ENTRIES`)
inspectable in devtools via `__lkDevLog()`. Fallback behavior is unchanged;
only the reporting channel moved.
