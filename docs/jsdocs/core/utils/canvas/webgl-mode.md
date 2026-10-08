# `core/utils/canvas/webgl-mode.ts`

Single choke point for WebGL availability. Every widget asks

| | |
|---|---|
| **Source** | `src/core/utils/canvas/webgl-mode.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

The effective WebGL mode declared by the URL — 'active' | 'fallback'.

### `webglMode`

Reads `?debug=webGLMode:<mode>` from the current location. Multiple
`debug` params are allowed; the LAST `webGLMode:` value wins so a
pasted URL can override an earlier flag.

### `webglAllowed`

Whether WebGL is currently preferred. Explicit debug fallback and the
user's reduced-motion mode both select the CSS/Canvas2D path; disabling
reduced motion makes the next interaction-driven retry eligible again.

### `webglContext`

`canvas.getContext('webgl')` + the 'experimental-webgl' alias in one call.
Returns null in fallback mode without touching the canvas at all — a
canvas that failed `getContext('webgl')` once can never hand it out
again, so probing must be skipped entirely, not faked.
