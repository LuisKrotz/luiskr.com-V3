[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/scene/surface-material](../README.md) / buildSurfaceMaterial

```ts
function buildSurfaceMaterial(__namedParameters): SurfaceMaterialResult
```

Defined in: [src/playground/earth/scene/surface-material.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/scene/surface-material.ts#L54)

Builds the Earth's surface material — all TSL so the same node graph
compiles to WGSL (WebGPU) or GLSL (WebGL fallback):
albedo × cloud-shadow × twilight-tint × terrain-self-shadow ×
eclipse-dim, specular-masked PBR, sun-faded bump, night-lights +
dark-side ambient emissive.

## Parameters

### \_\_namedParameters

[`SurfaceMaterialArgs`](../interfaces/SurfaceMaterialArgs.md)

## Returns

[`SurfaceMaterialResult`](../interfaces/SurfaceMaterialResult.md)
