# `utils/gpu/gpu-accel.ts`

Hardware GPU acceleration singleton: a lazily-created

| | |
|---|---|
| **Source** | `src/utils/gpu/gpu-accel.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### `GPUAccelerator`

Lazy GPU engine: context/program/texture are created on first use only.

### (module scope)

Cold-starts the GL context on first use (lazy — avoids module-init shader compile).

### `initGPU`

Creates a 1×1 offscreen WebGL2 (fallback WebGL1) context with a
fullscreen-quad passthrough program and one texture. Power preference
comes from glContextOptions() (dGPU detection). Mobile is skipped by
design; failures degrade silently to the CPU path.

### `compileShader`

Compiles a GLSL stage on the lazy context; deletes + returns null on failure.

### `accelerateElementGPU`

Promotes an element to its own GPU compositor layer (will-change +
translate3d + backface-visibility) for smooth transforms. Root/body get
scroll-position instead so scroll stays composited without a giant layer.

### `releaseElementGPU`

Reverses accelerateElementGPU — returns the element to normal compositing.

### (module scope)

Shared upload path: resize the offscreen canvas to the target,
upload the source into the bound texture (texImage2D accepts
Image/Video/ImageBitmap natively — the driver does the decode-to-VRAM
copy), LINEAR filtering + CLAMP_TO_EDGE for clean scaling, then draw
the 6-vertex fullscreen quad. The draw output itself is never read
back — the side effect (media resident in GPU memory, compositor
primed) is the point.

### `processVideoGPU`

Uploads the current video frame to the GPU texture; needs readyState ≥ 2 (HAVE_CURRENT_DATA).

### `processImageGPU`

Uploads an Image element to the GPU texture.

### `processTextureGPU`

Back-compat alias of processImageGPU.

### `processBitmapGPU`

Uploads a pre-decoded ImageBitmap (from the WASM decoder path) — zero-copy into VRAM.
