# `experiments/earth-playground/earth/setup/scene-setup.ts`

Scene assembly for the Earth engine: scene/camera/

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/setup/scene-setup.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `setupSceneCamera`

Scene + perspective camera + orbit controls.

### `setupSun`

Directional sun at 200u (far enough that its direction is effectively
parallel across the 20u Earth) + the visible 6u sprite co-located with
the light — color ×2 pushes it over the bloom threshold so it halos.

### (module scope)

Equirect starfield background texture + rotation/intensity config.

### (module scope)

Moon LOD, starting at angle π so it begins on the far side (-z) and
doesn't eclipse the sun in the first seconds after load.

### (module scope)

The 4-shell Earth group (see earth/meshes.ts). Anisotropy is maxed at
the renderer's supported level (clamped fallback 4) — equirect maps
sampled at grazing angles near the limb blur badly without it.
