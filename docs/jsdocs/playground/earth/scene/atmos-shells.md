# `playground/earth/scene/atmos-shells.ts`

Atmosphere shells for the Earth background — the BackSide

| | |
|---|---|
| **Source** | `src/playground/earth/scene/atmos-shells.ts` |
| **UX surface** | The /earth-playground WebGPU experience. |

## Members

### (module scope)

The AtmosShellsArgs value.

### (module scope)

The AtmosShellsResult value.

### `buildAtmosShells`

Builds both atmosphere shells sharing one scattering model:
  atmosMesh — BackSide additive shell (10.2u): the camera looks
              *through* the shell, so each fragment is the air between
              the viewer and the far wall
  innerMesh — FrontSide fresnel rim (+0.02u): (1 − view·n)⁶ is
              near-zero everywhere except the extreme grazing rim,
              producing the thin bright line at the limb
