# `core/utils/gpu/gpu-accel.ts`

Hardware GPU acceleration singleton: a lazily-created

| | |
|---|---|
| **Source** | `src/core/utils/gpu/gpu-accel.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `GPUAccelerator`

Lazy GPU engine: context/program/texture are created on first use only.

### `canvas`

Offscreen <canvas> backing the GL context — 1×1 until an upload resizes it.

### `gl`

WebGL2 (WebGL1 fallback) context — null before first use or on failure.

### `program`

Fullscreen-quad passthrough shader program.

### `texture`

Single reusable texture — all media uploads target it.

### `hasNPU`

WebNN 'ml' in navigator — NPU inference available.

### (module scope)

Init attempted (success or fail — never retried per instance).

### (module scope)

Cold-starts the GL context on first use (lazy — avoids module-init
shader compile blocking page load). The latch prevents retry storms:
a failed init stays failed for this instance.

### `initGPU`

Creates a 1×1 offscreen WebGL2 (fallback WebGL1) context with a
fullscreen-quad passthrough program and one texture. Power preference
comes from glContextOptions() (dGPU detection). Mobile is skipped by
design; failures degrade silently to the CPU path.

### `compileShader`

Compiles a GLSL stage on the lazy context; deletes + returns null on
failure so a bad shader never leaks a shader object.
- `@param` type gl.VERTEX_SHADER | gl.FRAGMENT_SHADER.
- `@param` source GLSL source text.
- `@returns` The compiled shader, or null.

### `accelerateElementGPU`

Promotes an element to its own GPU compositor layer (will-change +
translate3d + backface-visibility) for smooth transforms. Root/body get
scroll-position instead so scroll stays composited without a giant layer.
- `@param` el Element to promote (no-op on null/styleless).

### `releaseElementGPU`

Reverses accelerateElementGPU — returns the element to normal
compositing. Transform/backface are only cleared off root/body (those
never got them, and clearing body transforms could clobber author styles).
- `@param` el Element to release.

### (module scope)

Shared upload path: resize the offscreen canvas to the target,
upload the source into the bound texture (texImage2D accepts
Image/Video/ImageBitmap natively — the driver does the decode-to-VRAM
copy), LINEAR filtering + CLAMP_TO_EDGE for clean scaling, then draw
the 6-vertex fullscreen quad. The draw output itself is never read
back — the side effect (media resident in GPU memory, compositor
primed) is the point.

### `processVideoGPU`

Uploads the current video frame to the GPU texture; needs readyState
≥ 2 (HAVE_CURRENT_DATA) — earlier states have no frame to upload.
- `@param` videoEl Source video element.
- `@param` targetW Upload width hint (defaults to VIDEO_DIMENSIONS default).
- `@param` targetH Upload height hint.
- `@returns` true on upload, null when skipped, false on GL error.

### `processImageGPU`

Uploads an Image element to the GPU texture.
- `@param` imageEl Source image element.
- `@param` targetW Upload width hint.
- `@param` targetH Upload height hint.
- `@returns` true on upload, null when skipped, false on GL error.

### `processTextureGPU`

Back-compat alias of processImageGPU — kept so older call sites keep working.
- `@param` imageEl Source image element.
- `@param` targetW Optional width hint.
- `@param` targetH Optional height hint.
- `@returns` Same contract as processImageGPU.

### `processBitmapGPU`

Uploads a pre-decoded ImageBitmap (from the WASM decoder path) —
zero-copy into VRAM; the driver accepts ImageBitmap directly.
- `@param` bitmap Decoded bitmap.
- `@param` targetW Upload width hint.
- `@param` targetH Upload height hint.
- `@returns` true on upload, null when skipped, false on GL error.

### `gpuAccel`

Shared GPU accelerator singleton — one offscreen context + texture
serves every media upload, so the page never holds duplicate pipelines.
