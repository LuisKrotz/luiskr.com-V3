# `experiments/earth-playground/earth/scene/atmos-shells.ts`

Atmosphere shells for the Earth background — the BackSide

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/scene/atmos-shells.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Dependencies injected by the scene assembler (keeps this module mockable).

### `THREE`

The three.js namespace — geometry/material/mesh constructors.

### `TSL`

The TSL node-graph namespace (compiled to WGSL/GLSL by the renderer).

### `mats`

The node material constructor for the shell materials.

### `sunDir`

Shared sun-direction uniform the scattering phase functions read.

### (module scope)

The two atmosphere meshes — outer scattering shell + inner fresnel rim.

### `atmosMesh`

BackSide additive scattering shell (ATMOS_RADIUS).

### `innerMesh`

FrontSide fresnel rim hugging the surface (+0.02u).

### `buildAtmosShells`

Builds both atmosphere shells sharing one scattering model:
  atmosMesh — BackSide additive shell (10.2u): the camera looks
              *through* the shell, so each fragment is the air between
              the viewer and the far wall
  innerMesh — FrontSide fresnel rim (+0.02u): (1 − view·n)⁶ is
              near-zero everywhere except the extreme grazing rim,
              producing the thin bright line at the limb
