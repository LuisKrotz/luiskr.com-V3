# `experiments/earth-playground/earth/consts.ts`

Scene-graph scale constants + shared TSL arg types for the

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/consts.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `EARTH_RADIUS`

Scene-graph scale constants. The Earth sphere is 10 world units across the
radius — an arbitrary "comfortable" scale that keeps camera distances and
light falloff in the 10–200 range where float precision is excellent.

### `EARTH_AXIAL_TILT`

Earth's real axial tilt — 23.44° converted to radians for the group rotation.

### `ATMOS_RADIUS`

Outer atmosphere shell radius. 2% larger than the surface (10.2/10) — real
Earth's effective scattering shell is ~1% of radius (100km/6371km), but a
slightly exaggerated shell reads better visually at this scale.

### `SEG_HIGH`

Sphere tessellation: 128×128 segments ≈ 32k triangles per shell. Chosen so
the silhouette stays smooth when the camera zooms to 1.2× radius — below
~64 segments the limb shows polygon edges.

### (module scope)

Arg shapes for the Fn-defined post nodes — per-node-type annotations
 unlock the typed swizzle/fluent-op surface (vec4 gets .rgb/.a, float
 gets .mul/.add etc.).

### (module scope)

Args for the vignette post node — `{ color, uv, darkness, offset }`,
typed so the Fn body gets the fluent vec/float node surface.
