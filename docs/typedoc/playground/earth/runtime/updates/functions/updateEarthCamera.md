[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/updates](../README.md) / updateEarthCamera

```ts
function updateEarthCamera(s, __namedParameters?): void
```

Defined in: [src/playground/earth/runtime/updates.ts:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/runtime/updates.ts#L82)

Camera tweaks. `fov` needs updateProjectionMatrix() to rebuild the
frustum; orbit flags write straight into OrbitControls.
fov - vertical field of view in degrees
autoRotate - slow turntable orbit
autoRotateSpeed - degrees/sec equivalent (three's scale: 2.0 ≈ 30s/rev)

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

### \_\_namedParameters?

#### fov?

`number`

#### autoRotate?

`boolean`

#### autoRotateSpeed?

`number`

## Returns

`void`
