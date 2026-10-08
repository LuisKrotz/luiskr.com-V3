# `experiments/earth-playground/earth/scene/meshes.ts`

Scene mesh builders for the WebGPU Earth background —

| | |
|---|---|
| **Source** | `src/experiments/earth-playground/earth/scene/meshes.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Everything the Earth builder needs from the engine instance.

### (module scope)

What buildEarthShells hands back for the engine to assign.

### (module scope)

Builds the 4-shell Earth group, all in TSL so the same node graph
compiles to WGSL (WebGPU) or GLSL (WebGL fallback):

  earthMesh  — surface: albedo × cloud-shadow × twilight-tint ×
               terrain-self-shadow × eclipse-dim, specular-masked PBR,
               sun-faded bump, night-lights + dark-side ambient emissive
  cloudsMesh — transparent shell +0.05u above surface, rotates at 0.2×
  atmosMesh  — BackSide additive shell (10.2u): Rayleigh+Mie scattering
               + airglow limb bands, viewed from inside
  innerMesh  — FrontSide additive fresnel rim (+0.02u): the thin bright
               limb hugging the planet edge

### (module scope)

Moon as a 3-level LOD sphere (radius 5, half Earth's visual size at
10× distance — exaggerated vs the real 0.27× so it reads at a glance).
96/48/32-seg meshes swap at 30u/60u camera distance; a faint 0.02
emissive map keeps the dark limb visible.
- `@param` {object} THREE - three namespace
- `@returns` {Promise<THREE.LOD>}
