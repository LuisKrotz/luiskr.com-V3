[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/runtime/updates](../README.md) / updateEarthCamera

```ts
function updateEarthCamera(s, __namedParameters?): void;
```

Defined in: [experiments/earth-playground/earth/runtime/updates.ts:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/updates.ts#L82)

Camera tweaks. `fov` needs updateProjectionMatrix() to rebuild the
frustum; orbit flags write straight into OrbitControls.
  fov             - vertical field of view in degrees
  autoRotate      - slow turntable orbit
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
