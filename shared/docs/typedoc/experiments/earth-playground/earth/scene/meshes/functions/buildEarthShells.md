[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/scene/meshes](../README.md) / buildEarthShells

```ts
function buildEarthShells(__namedParameters): Promise<EarthShellsResult>;
```

Defined in: [experiments/earth-playground/earth/scene/meshes.ts:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/meshes.ts#L57)

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

## Parameters

### \_\_namedParameters

[`EarthShellsArgs`](../interfaces/EarthShellsArgs.md)

## Returns

`Promise`\<[`EarthShellsResult`](../interfaces/EarthShellsResult.md)\>
