# `playground/earth/surface-material.ts`

Surface material node graph for the Earth shell —

| | |
|---|---|
| **Source** | `src/playground/earth/surface-material.ts` |
| **UX surface** | The /earth-playground WebGPU experience. |

## Members

### `buildSurfaceMaterial`

Builds the Earth's surface material — all TSL so the same node graph
compiles to WGSL (WebGPU) or GLSL (WebGL fallback):
  albedo × cloud-shadow × twilight-tint × terrain-self-shadow ×
  eclipse-dim, specular-masked PBR, sun-faded bump, night-lights +
  dark-side ambient emissive.
