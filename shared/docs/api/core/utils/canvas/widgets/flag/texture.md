# `core/utils/canvas/widgets/flag/texture.ts`

Flag asset caches for FlagRenderer: per-country-code

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/flag/texture.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `kickWasmDecode`

Kicks the worker-side decode once per country code: the WASM pool fetches
the SVG and rasterizes it through createImageBitmap with GPU resize hints,
so flag pixels arrive as a POT-sized ImageBitmap instead of a main-thread
decode + 2D-canvas resample. Falls back silently — the <img> path below
still produces the texture when the worker can't.

### (module scope)

Awaits one worker decode and caches the landed bitmap for cc; a null
result or a rejected dispatch (worker unavailable) leaves the <img>
fallback path in charge of the texture.

### `flagImage`

Builds (once) and caches the flag's composited <img> for country code
cc — composite means the base flag plus any overlays (e.g. the EU
circle for split-locale flags) baked into one source image. The <img>
stays the fallback decode path and the natural-aspect probe.

### (module scope)

Sources the flag texture can be built from — <img>, POT canvas or a worker bitmap.

### `uploadTexture`

Uploads a POT-sized source as a mipmapped GL texture and caches it per cc.

### `potSource`

Resizes a source into a POT canvas when it isn't already at flag size.

### `flagTexture`

Builds/caches the GL texture for the flag image.
