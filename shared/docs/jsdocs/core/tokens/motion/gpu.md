# `core/tokens/motion/gpu.ts`

GPU detection & power-hint tokens — renderer-string

| | |
|---|---|
| **Source** | `src/core/tokens/motion/gpu.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `DEDICATED`

Desktop discrete GPUs (NVIDIA / AMD / Intel Arc)

### `APPLE`

Apple Silicon — unified memory but performant; safe to treat as capable

### `INTEGRATED`

Integrated/mobile GPUs where the discrete hint is meaningless

### `SOFTWARE`

CPU rasterizers — never request high-performance

### `UA_PATTERNS`

Frozen ua map — sole declaration site for these tokens; consumers read members and never
re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.

### `MOBILE_UA`

Mobile user agents — WebGL hinting is irrelevant (single GPU path)

### `QUAD_STRIP`

Fullscreen-quad clip-space vertices for TRIANGLE_STRIP draw — 4 verts
covering [-1,-1]→[1,1]. Shared by every shader quad so the literal is
declared once (zero-hardcoding rule); VERTEX_COUNT is the drawArrays n.

### `WEBGL_POOL_OBSERVER`

WebGL-pool visibility observer tuning — a 1% intersection suffices to
count a canvas as visible (any pixel restores it; the rootMargin
pre-warms slightly before it scrolls in).
