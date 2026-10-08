# `experiments/earth-playground/earth/runtime/state.ts`

Mutable engine state for EarthBackground, extracted from

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/runtime/state.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Progress callback signature — label + percent so the loader UI can show
which asset is streaming and how far along the whole boot is.
- `@param` _label Asset label for the loader text.
- `@param` percent 0–100 progress through the boot sequence.

### (module scope)

Sun settings driven by the control panel.

### `autoRotate`

Whether the sun orbits automatically.

### `speed`

Orbit angular speed (rad/frame scale).

### `inclination`

Orbit plane inclination (rad).

### `intensity`

Directional-light intensity.

### `color`

Packed RGB light color.

### `angle`

Current orbit angle (rad) — advanced per frame when autoRotate.

### (module scope)

Moon orbit settings driven by the control panel.

### `enabled`

Whether the moon layer is rendered at all.

### `speed`

Orbit angular speed.

### `distance`

Orbit radius in world units.

### `inclination`

Orbit plane inclination (rad).

### `angle`

Current orbit angle (rad).

### (module scope)

Earth self-rotation settings.

### `rotationSpeed`

Y-rotation speed applied per frame.

### `trueInclination`

When true the real 23.44° tilt is applied to the group.

### (module scope)

Bloom post-pass settings.

### `strength`

Bloom intensity multiplier.

### `radius`

Bloom kernel radius.

### `threshold`

Luminance threshold above which pixels bleed.

### (module scope)

Chromatic-aberration post-pass settings.

### `strength`

RGB channel split magnitude.

### `scale`

Effect radial scale.

### (module scope)

Vignette post-pass settings.

### `darkness`

Edge darkening amount.

### `offset`

Where the falloff starts (0–1 UV distance).

### (module scope)

Film-grain post-pass settings.

### `intensity`

Grain opacity/intensity.

### (module scope)

Color-grade post-pass settings.

### `contrast`

Contrast multiplier around mid-gray.

### `saturation`

Saturation multiplier (1 = unchanged).

### `blackLevel`

Lift applied to the black point.

### `blueGreenBoost`

Extra blue/green channel gain for the oceanic palette.

### (module scope)

The single mutable bag for the whole engine — every async-created GPU
handle is nullable because bootstrap fills them progressively and a
mid-boot dispose must see exactly what's live.

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

Builds the initial null-everything state bag — every GPU handle starts
null so bootstrap can fill them in any order and dispose can skip
whatever never got created.
- `@param` canvas The target canvas element.
- `@param` onReady Callback once the scene is first rendered.
- `@param` onProgress Boot progress reporter.
- `@returns` The zeroed state bag.
