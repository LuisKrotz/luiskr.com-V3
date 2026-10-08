# `experiments/earth-playground/earth/scene/surface-material.ts`

Surface material node graph for the Earth shell —

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/scene/surface-material.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Dependencies injected by the scene assembler (keeps this module mockable).

### `THREE`

The three.js namespace — Color/constructors used for uniforms.

### `TSL`

The TSL node-graph namespace.

### `mats`

The physical node material constructor.

### `colorTex`

Day-side albedo texture (equirectangular).

### `specTex`

Specular mask — bright over oceans.

### `normalTex`

Tangent-space normal map for terrain.

### `cloudsTex`

Cloud coverage — also resampled for the fake shadow offset.

### `nightTex`

Night city-lights emissive texture.

### `sunDir`

Shared sun-direction uniform.

### `moonPos`

Shared moon-position uniform (eclipse cone test).

### (module scope)

The built material plus the uniforms/nodes other shells reuse.

### `mat`

The configured physical node material for the Earth mesh.

### `earthMatUniforms`

Slider-bound uniforms (GUI writes straight into .value).

### `shared`

Lighting terms shared with the cloud/atmosphere shells so the day/night/eclipse model stays consistent.

### `twilTint`

Twilight tint multiplier node.

### `eclDim`

Eclipse dimming multiplier node.

### `nightFade`

0→1 night-side factor node.

### `darkBr`

Dark-side ambient brightness uniform.

### `bumpFade`

Bump-strength fade node (kills normal map at twilight).

### `buildSurfaceMaterial`

Builds the Earth's surface material — all TSL so the same node graph
compiles to WGSL (WebGPU) or GLSL (WebGL fallback):
  albedo × cloud-shadow × twilight-tint × terrain-self-shadow ×
  eclipse-dim, specular-masked PBR, sun-faded bump, night-lights +
  dark-side ambient emissive.
