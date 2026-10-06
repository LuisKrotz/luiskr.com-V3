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

### `MOBILE_UA`

Mobile user agents — WebGL hinting is irrelevant (single GPU path)

### `GPU`

Composed view — backwards-compatible registry.
