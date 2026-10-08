# `core/utils/wasm/wasm-media-threads.ts`

Off-main-thread media pipeline built on the WASM worker pool:

| | |
|---|---|
| **Source** | `src/core/utils/wasm/wasm-media-threads.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

One candidate rendition of a video — URL plus optional quality metadata.

### `url`

CDN URL of this rendition.

### (module scope)

Quality label ('360p', '720p', …) — informational for the worker.

### (module scope)

Rendition pixel width — drives the GPU-upload resize hint.

### (module scope)

Rendition pixel height — drives the GPU-upload resize hint.

### (module scope)

Result of the lightweight header probe — filled by the worker.

### (module scope)

Detected codec string (e.g. 'avc1.42E01E'), when parseable.

### (module scope)

Total byte size, when the server reports Content-Length/ranges.

### (module scope)

Whether the server honored the Range request (206 vs 200).

### (module scope)

Worker may attach extra diagnostics — forward-compatible.

### (module scope)

Outcome of a quality-variant prefetch — the winning variant + poster.

### (module scope)

Variant the worker judged best (first byte-range to arrive / quality).

### (module scope)

Poster frame decoded to a zero-copy ImageBitmap in the worker.

### (module scope)

Extra worker diagnostics — forward-compatible.

### (module scope)

Worker postMessage envelope — `results` for structured replies, `bitmap` for flat single-bitmap replies.

### (module scope)

One byte-range fetch request for parallel segment download.

### `url`

URL of the resource (same file, different ranges).

### (module scope)

Inclusive start offset — defaults to 0 when omitted.

### (module scope)

Exclusive end offset — null fetches to EOF.

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
- `@param` url CDN image URL.
- `@param` width GPU-upload resize-hint width.
- `@param` height GPU-upload resize-hint height.
- `@returns` The decoded bitmap, or null on any failure.

### `probeVideo`

Range-requests the first 128 KB of a video URL in a worker thread to
detect codec, total size, and range-request support — without
downloading the full file. Used by the NPU predictor before the user
navigates so quality-variant choice is informed, not guessed.
Memoized per URL — repeat probes short-circuit.
- `@param` url Video URL to header-probe.
- `@returns` The probe result, or null on failure.

### `prefetchVideoVariants`

Dispatches one worker to simultaneously fetch the first 256 KB of every
quality variant + the poster frame — returning the best available
variant URL and a zero-copy poster ImageBitmap. The cache key is the
first variant's URL (the canonical "this video" identifier).
A successful poster is uploaded to GPU VRAM immediately at FHD
fallback dimensions.
- `@param` variants Rendition list; `variants[0].url` is the cache key.
- `@param` posterUrl Optional poster image to decode alongside.
- `@returns` {best, poster} or null on failure.

### `fetchSegmentsParallel`

Fetches N byte-range segments simultaneously — each dispatch
round-robins to a different pool worker, so ranges genuinely download
in parallel threads. Returns zero-copy results for MediaSource or
WebCodecs consumption; failed segments are filtered out (partial
results are still usable — the caller decides if gaps are fatal).
- `@param` segmentList Byte-range requests over the same or related URLs.
- `@returns` Array of segment payloads (failures filtered out).

### `applyBestVariant`

After prefetchVideoVariants resolves: sets the winning URL on the
element (skipped when already identical to avoid a reload) and
uploads the poster to GPU at the element's rendered size, falling
back to FHD dimensions when the element isn't laid out yet.
- `@param` videoEl Target video element.
- `@param` prefetchResult Result from prefetchVideoVariants.

### `wasmMediaThreads`

Shared media-threads singleton — the three memoization maps are global
so probes/prefetches/decodes are deduplicated across every surface.
