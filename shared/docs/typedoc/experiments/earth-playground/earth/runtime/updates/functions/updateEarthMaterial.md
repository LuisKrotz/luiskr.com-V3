[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/runtime/updates](../README.md) / updateEarthMaterial

```ts
function updateEarthMaterial(s, __namedParameters?): void;
```

Defined in: [experiments/earth-playground/earth/runtime/updates.ts:120](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/updates.ts#L120)

Surface-shader uniforms: ocean PBR (specular mask drives the land/ocean
blend), relief bump scale, and the fake terrain self-shadowing terms
(see the offset-normal trick in buildEarthShells).
  terrainShadowOffset - UV-space offset along the sun-projected tangent

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

### \_\_namedParameters?

#### waterMetalness?

`number`

#### waterRoughness?

`number`

#### bumpScale?

`number`

#### terrainShadowIntensity?

`number`

#### terrainShadowOffset?

`number`

## Returns

`void`
