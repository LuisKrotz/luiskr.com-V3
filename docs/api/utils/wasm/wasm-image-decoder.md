# `utils/wasm/wasm-image-decoder.ts`

Image decode pipeline: fetch → worker-side createImageBitmap

| | |
|---|---|
| **Source** | `src/utils/wasm/wasm-image-decoder.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `decodeImageBatchWASM`

Batch decode: splits the pending list across the pool's workers and
decodes in parallel, returning a url→ImageBitmap Map. Cached URLs are
served from bitmapCache without a worker hop.

### `clearCache`

Releases every cached ImageBitmap (frees GPU-backed memory) and clears the map.
