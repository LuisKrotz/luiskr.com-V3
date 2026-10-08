# `experiments/earth-playground/earth/runtime/updates.ts`

Live-tweak API for the Earth engine, extracted from

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/runtime/updates.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `updateEarthBloom`

Live-tweak bloom. `enabled` collapses strength to 0 rather than
removing the pass — the node graph stays compiled, so toggling is
free (no shader rebuild).

### `updateEarthColorGrading`

Live-tweak the color-grade node. Every arg mirrors straight into a TSL
uniform; see makePostNodes for the per-term math.
  contrast      - multiplier around mid-grey (1 = neutral)
  saturation    - lerp weight between luma and color
  blackLevel    - floor subtracted before output
  blueGreenBoost - extra gain on G+B channels

### `updateEarthCamera`

Camera tweaks. `fov` needs updateProjectionMatrix() to rebuild the
frustum; orbit flags write straight into OrbitControls.
  fov             - vertical field of view in degrees
  autoRotate      - slow turntable orbit
  autoRotateSpeed - degrees/sec equivalent (three's scale: 2.0 ≈ 30s/rev)

### `updateEarthSpin`

Earth spin tweaks. rotationSpeed is radians/frame applied in tickEarth;
trueInclination toggles the fixed 23.44° axial tilt on rotation.z.

### `updateEarthMaterial`

Surface-shader uniforms: ocean PBR (specular mask drives the land/ocean
blend), relief bump scale, and the fake terrain self-shadowing terms
(see the offset-normal trick in buildEarthShells).
  terrainShadowOffset - UV-space offset along the sun-projected tangent

### `updateEarthVignette`

Vignette tweaks — enabled collapses darkness to 0 (same zero-cost
toggle pattern as bloom).
  darkness - exponent + lerp weight of the falloff
  offset   - radial distance scale before the falloff

### `updateEarthChromatic`

Chromatic aberration tweaks — enabled collapses strength to 0.
  strength - fringe offset in normalized UV units
  scale    - radial falloff of the fringe

### `updateEarthRender`

Resolution-scale multiplier (clamped ≤2) applied on top of
devicePixelRatio — the "render resolution" slider in the playground.
Triggers a resize so the new pixel ratio takes effect immediately.

### `updateEarthFilm`

Film-grain tweaks — enabled collapses intensity to 0.

### `updateEarthSun`

Sun-orbit tweaks — autoRotate flips the per-frame advance, speed scales
the .01 rad/frame increment, and angle repositions the sun on its orbit
circle (used by the playground to restore a persisted sun state).

### `getEarthCameraState`

Current camera position + orbit target, rounded to 2 decimals — used
to persist/restore the view in the playground's settings snapshot.

### `resetEarthView`

Restore the default framing: OrbitControls.reset() replays saveState()
(captured at bootstrap), then fov/position/target are pinned to
DEFAULT_SP_GUI.CAMERA in case the saved state drifted.
