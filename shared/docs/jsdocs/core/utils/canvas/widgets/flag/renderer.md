# `core/utils/canvas/widgets/flag/renderer.ts`

Shared WebGL renderer for FlagWebGL. One GL context serves

| | |
|---|---|
| **Source** | `src/core/utils/canvas/widgets/flag/renderer.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `FlagRenderer`

One WebGL context for every flag on the page. Each FlagWebGL owns only a
2D canvas; frames are rendered on the shared GL canvas and blitted over.
Textures are decoded once per country code and shared by all instances.
The context and every texture are released when the last flag is
destroyed and recreated on demand when a flag is mounted again.

### `bitmaps`

Worker-decoded flag bitmaps (WASM pool) — preferred texImage2D source.

### `_bitmapPending`

Country codes with an in-flight worker decode — dedupes kickWasmDecode.

### `acquire`

Borrows (and lazily creates) the shared GL context.

### `release`

Returns the shared context to the pool, disposing when refcount hits zero.

### `_init`

Creates the GL context, flag shaders and textures.

### `_dispose`

Frees GL program, textures and buffers.

### `image`

Builds (once) and caches the flag's composited <img> for country code
cc — composite means the base flag plus any overlays (e.g. the EU
circle for split-locale flags) baked into one source image.
- `@param` {string} cc
- `@returns` {HTMLImageElement}

### `texture`

Builds/caches the GL texture for the flag image.

### `draw`

Renders one wave-shader frame for a flag (or its split pair for dual
flags like en-GB/en-US hybrids) onto the shared canvas, then blits
the result to the flag's own 2D canvas at time t.

### `_initProgram`

Compiles the wave vertex/fragment shaders and resolves uniform locations.

### `flagRenderer`

flags renderer.
