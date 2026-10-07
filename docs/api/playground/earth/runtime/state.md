# `playground/earth/runtime/state.ts`

Mutable engine state for EarthBackground, extracted from

| | |
|---|---|
| **Source** | `src/playground/earth/runtime/state.ts` |
| **UX surface** | The /earth-playground WebGPU experience. |

## Members

### (module scope)

earths progress fn.
- `@param` _label — the value
- `@param` percent — the value

### (module scope)

Type contract for earth sun state.

### (module scope)

earths moon state.

### (module scope)

earths spin state.

### (module scope)

earths bloom state.

### (module scope)

earths ca state.

### (module scope)

earths vig state.

### (module scope)

earths film state.

### (module scope)

earths grade state.

### (module scope)

earths state.

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

### `createEarthState`

Creates earth state.
