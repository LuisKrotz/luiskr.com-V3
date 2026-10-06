# `utils/wasm/wasm-media-threads.ts`

Off-main-thread media pipeline built on the WASM worker pool:

| | |
|---|---|
| **Source** | `src/utils/wasm/wasm-media-threads.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `WASMMediaThreadManager`

Orchestrator over wasmPool.dispatch + gpuAccel. Three memoization maps
key results by URL so repeat requests (carousel re-renders, related-item
mounts) never re-dispatch worker work.

### `decodedBitmaps`

URL → ImageBitmap — decoded poster/frame results, zero-copy.

### `probedUrls`

URL → probe result {codec, size, rangeSupported}.

### `prefetchedVideos`

First-variant URL → {best, poster} prefetch results.

### `decodeMediaInSeparateThread`

Decodes one image URL to an ImageBitmap in a pool worker, then uploads
it to GPU at the requested display size. Cache hit → GPU re-upload only
(the bitmap is already resident). Any worker/decode failure resolves
null so callers fall back to <img> decode.

### `probeVideo`

Range-requests the first 128 KB of a video URL in a worker thread to
detect codec, total size, and range-request support — without
downloading the full file. Used by the NPU predictor before the user
navigates so quality-variant choice is informed, not guessed.

### `prefetchVideoVariants`

Dispatches one worker to simultaneously fetch the first 256 KB of every
quality variant + the poster frame — returning the best available
variant URL and a zero-copy poster ImageBitmap. The cache key is the
first variant's URL (the canonical "this video" identifier).
A successful poster is uploaded to GPU VRAM immediately at FHD
fallback dimensions.

### `fetchSegmentsParallel`

Fetches N byte-range segments simultaneously — each dispatch
round-robins to a different pool worker, so ranges genuinely download
in parallel threads. Returns zero-copy results for MediaSource or
WebCodecs consumption; failed segments are filtered out (partial
results are still usable — the caller decides if gaps are fatal).

### `applyBestVariant`

After prefetchVideoVariants resolves: sets the winning URL on the element and uploads the poster to GPU.
