# `utils/wasm/wasm-image-decoder.ts`

Image decode pipeline: fetch → worker-side createImageBitmap

| | |
|---|---|
| **Source** | `src/utils/wasm/wasm-image-decoder.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### (module scope)

Decodes item.

### `WASMImageDecoder`

Decodes images via createImageBitmap with GPU resize hints and caches the
resulting ImageBitmaps keyed by URL, so repeat draws skip decode entirely.

### `decodeImageBatchWASM`

Batch decode: splits the pending list across the pool's workers and
decodes in parallel, returning a url→ImageBitmap Map. Cached URLs are
served from bitmapCache without a worker hop.

### `clearCache`

Releases every cached ImageBitmap (frees GPU-backed memory) and clears the map.

### `wasmImageDecoder`

The wasmImageDecoder constant.
