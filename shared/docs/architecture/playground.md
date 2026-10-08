# Earth Playground (experiments/earth-playground)

An experimental full-screen WebGPU scene — Earth with atmosphere, clouds, moon,
starfield and post-processing — with a translated control panel. Routes:
`/earth-playground` (canonical) and `/space-playground` (legacy alias, kept
because it is indexed).

## Files

| File                                                                                                         | Role                                                                         |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `SpacePlayground.tsx`                                                                                        | Route view facade: mounts canvas, builds the settings panel, owns the loader |
| `space/boot.ts` · `space/wiring.ts`                                                                          | Panel lifecycle + control wiring                                             |
| `space/controls.ts` · `space/panel-render.tsx` · `space/render.tsx`                                          | Control schema, panel + view JSX                                             |
| `space/i18n.ts`                                                                                              | Panel label helpers                                                          |
| `space/checkbox-webgl.ts`                                                                                    | `CheckboxWebGL` — animated toggle used by the panel                          |
| `earth-background.ts`                                                                                        | `EarthBackground` facade — owns state + public API                           |
| `earth/setup/bootstrap.ts` (+`renderer-setup`,`scene-setup`,`post-setup`)                                    | WebGPU init pipeline                                                         |
| `earth/runtime/frame.ts` · `earth/runtime/updates.ts`                                                        | RAF loop, resize, sun sync, control updates                                  |
| `earth/scene/meshes.ts` (+`surface-material`,`atmos-shells`)                                                 | Earth/cloud/atmosphere mesh + TSL node graphs                                |
| `earth/scene/post-nodes.ts` · `earth/settings.ts` · `earth/runtime/state.ts` · `earth/runtime/screenshot.ts` | Post-fx node builders, settings snapshot, state bag, screenshot              |
| `space-playground.scss`                                                                                      | View stylesheet (panel, HUD, loader)                                         |

## Loader contract

The loader must reach 100% only when the first frame is **presented**, not when
assets are merely loaded:

```
SpacePlayground._earthReady = false   → loader mounted
EarthBackground.init()
  → textures (earth, clouds, stars, moon)
  → TSL node graph compiled (compileAsync)        → progress ~90%
  → #renderFrame() draws frame 0
  → device.queue.onSubmittedWorkDone()            GPU work submitted
  → requestAnimationFrame × 2                     present boundary
  → onProgress(100) + onReady()
      → _earthReady = true → loader fades
```

Two historical bugs this prevents:

1. `_earthBg` (constructor-assigned) gated the loader → it vanished before any
   GPU work ran. Gate on `_earthReady` instead.
2. `onReady` fired after `compileAsync` → loader faded onto a black canvas and
   the earth popped in. Now the first frame is rendered and awaited before
   `onReady`.

Error path: init failures call `_dismissLoader()` so the loader can never hang
forever. Reduced-motion renders a single static frame (no RAF loop).

## Render loop

`#tick` is split into `#updateScene(dt)` / `#renderFrame()` so `init()` can
render the warm-up frame without starting the loop. The RAF loop only starts
after the first present. Pausing (`setVisible(false)`, tab hidden) cancels the
frame callback; `dispose()` releases buffers, programs, textures and the
canvas.

## Controls panel

Panel groups and labels come from `pages/EARTH_PLAYGROUND` (39 keys):
camera (fov, rotate speed, auto-rotate, reset), earth (spin, engine toggle,
water metalness), terrain (bump, self-shadow), post-fx (bloom, vignette,
chromatic aberration, film grain, color/contrast/saturation/black level),
debug (stats, resolution scale, screenshot, copy constants, position/target
readouts). Editable via the CMS **Playground & Lang Keys** tab.

`setTheme(isDark)` exists on `EarthBackground` for the future lit/night
hemisphere toggle (stores `_isDark`; sun-rotation behavior not yet wired).

## Defaults (data-driven)

`pages/earth-playground/defaults` holds the initial value for every control
(`fov`, `rotateSpeed`, `bloom`, `filmGrain`, … booleans for toggles). The
component fetches that node on mount and merges it over the built-in
`SLIDER_GROUPS` constants before the panel renders — CMS edits therefore
change what every visitor's controls start from, per locale. The CMS
**Playground & Lang Keys** tab edits `defaults` as typed fields (number /
checkbox) under the same `pages/earth-playground` write.

```
CMS defaults editor ──set──► translations/<loc>/pages/earth-playground/defaults
                                        │
SpacePlayground.loadData ──get──► merge defaults + SLIDER_GROUPS
                                        │
                                   control panel renders initial state
```
