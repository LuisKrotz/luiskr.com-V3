# WebGL / canvas utilities (src/utils/canvas)

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

| Facade                             | Modules                                                           | Used by                                             | Fallback                   |
| ---------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------- | -------------------------- |
| `webgl-pool.ts`                    | —                                                                 | everything below                                    | —                          |
| `loaders/menu-background-webgl.ts` | `loaders/menu-background/{init,loop,shaders,theme}`               | AppNav menu backdrop                                | plain backdrop, no canvas  |
| `loaders/skeleton-webgl.ts`        | `loaders/skeleton/{init,loop,measure,renderer,shaders,theme}`     | BaseComponent skeleton layer                        | CSS shimmer only           |
| `loaders/intro-loader.ts`          | —                                                                 | App bootstrap                                       | text loader                |
| `widgets/burger-button-webgl.ts`   | `widgets/burger-button/shaders`                                   | AppNav burger                                       | CSS lines                  |
| `widgets/close-button.ts`          | `widgets/close-button/{init,render,shaders}`                      | AppNav, LangDialog, PreferencesModal, MediaExpanded | `is-fallback` → CSS × mark |
| `widgets/flag-webgl.ts`            | `widgets/flag/{anim,draw,gl,loop,renderer,shaders,texture}`       | AppNav, LangDialog                                  | static flag image          |
| `widgets/theme-slider.ts`          | `widgets/theme-slider/{events,init,math,paint-2d,render,shaders}` | PreferencesModal                                    | native checkbox            |
| `widgets/switch-slider.ts`         | `widgets/switch-slider/{init,paint-2d,render,shaders}`            | PreferencesModal                                    | native checkbox            |
| `widgets/carousel-controls.ts`     | `widgets/carousel-controls/paint-2d`                              | CustomCarousel arrows                               | CSS arrows                 |

`earth-background.ts` and `space/checkbox-webgl.ts` are **not** here — they
are playground-owned and live in `src/playground/`.

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

`syncSkeletonLayer(host, boxes, resolve)` samples the host's computed style
(incl. `color-mix()` results) per rect, builds a glyph/"decoding" shader layer
and sits on top of the CSS shimmer. On `resolve()` the canvas fades, the
content fades in (`content-in`), then the GL context is destroyed.

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
