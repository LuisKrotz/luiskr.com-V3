# `core/utils/canvas/gl-program.ts`

Shared WebGL boilerplate for the canvas widgets — every

| | |
|---|---|
| **Source** | `src/core/utils/canvas/gl-program.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `getWebGLContext`

Probes the canvas for a WebGL context — prefers `webgl`, falls back to
`experimental-webgl`. Returns null when the browser has no GL support or
when `?debug=webGLMode:fallback` forces the CSS/2D surface (callers then
take their fallback path).

### `compileShader`

Compiles one shader; warns with `label` + stage on failure.

### (module scope)

Compiles + links a vertex/fragment pair and uploads the shared
fullscreen-quad buffer ([-1,-1 … 1,1] triangle pair). Returns null on
any stage failure — the caller treats it as "no WebGL" and falls back.

### (module scope)

Quad vertex layout — defaults to the 6-vertex TRIANGLES quad;
 TRIANGLE_STRIP callers pass their 4-vertex ordering instead.

### (module scope)

Custom warn sink — stage is 'VS' | 'FS' | 'Link' | 'fallback'.

### (module scope)

Blend factors — default premultiplied (ONE, ONE_MINUS_SRC_ALPHA);
 false gives straight-alpha (SRC_ALPHA, ONE_MINUS_SRC_ALPHA).

### `createQuadProgram`

Creates quad program.

### `getUniforms`

Resolves a uniform-location map — keys are the caller's shorthand,
 values are the shader's `u_*` names (identical keys work too).

### `bindQuad`

Binds the quad buffer to `a_pos` — the common pre-uniforms draw step.
