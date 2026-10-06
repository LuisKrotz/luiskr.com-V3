# `playground/earth/state.ts`

Mutable engine state for EarthBackground, extracted from

| | |
|---|---|
| **Source** | `src/playground/earth/state.ts` |
| **UX surface** | The /earth-playground WebGPU experience. |

## Members

### `animId`

RAF handle for the render loop; null while paused/reduced-motion.

### `disposed`

Set by destroy(); checked after every await so a mid-load dispose
 aborts scene assembly without touching the GPU again.

### `reduced`

Mirrors the store's reduced-motion flag; freezes the loop.

### `isDarkTheme`

UI theme flag — stored for the sun-rotation feature (not yet wired).

### `onResize`

Stable resize-listener identity so destroy() can removeEventListener.
