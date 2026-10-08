# `core/utils/wasm/wasm-image-decoder.ts`

Image decode pipeline: fetch → worker-side createImageBitmap

| | |
|---|---|
| **Source** | `src/core/utils/wasm/wasm-image-decoder.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

One queued decode request — URL plus optional GPU resize hints.

### `url`

CDN URL of the source image.

### (module scope)

Target display width — passed to createImageBitmap as a resize hint.

### (module scope)

Target display height — passed to createImageBitmap as a resize hint.

### (module scope)

A decode request after defaults are applied — index preserves input order.

### (module scope)

Worker postMessage envelope — `results` carries either the batch array
or a single {bitmap} object depending on the action; `bitmap` covers
the flat single-result reply shape.

### `WASMImageDecoder`

Decodes images via createImageBitmap with GPU resize hints and caches the
resulting ImageBitmaps keyed by URL, so repeat draws skip decode entirely.

### `bitmapCache`

URL → decoded ImageBitmap — repeat draws skip fetch+decode entirely.

### `decodeImageWASM`

Single-image decode — passes GPU resize hints so createImageBitmap
resizes in hardware at decode time, not in software afterward.
`fetch(cache:'force-cache')` reuses the HTTP cache so a prior <img>
warm-up doesn't double-download. Every failure arm resolves null —
callers fall back to plain <img> decode.
- `@param` url CDN image URL.
- `@param` targetW GPU resize-hint width.
- `@param` targetH GPU resize-hint height.
- `@returns` The decoded+GPU-uploaded bitmap, or null.

### `decodeImageBatchWASM`

Batch decode: splits the pending list across the pool's workers and
decodes in parallel, returning a url→ImageBitmap Map. Cached URLs are
served from bitmapCache without a worker hop.
- `@param` items Decode requests; entries without a URL are skipped.
- `@returns` url→bitmap map — missing URLs simply have no entry.

### `clearCache`

Releases every cached ImageBitmap (frees GPU-backed memory) and clears the map.

### `wasmImageDecoder`

Shared decoder singleton — the bitmap cache is global so a bitmap
decoded for one surface (mosaic) is reused by another (carousel).
