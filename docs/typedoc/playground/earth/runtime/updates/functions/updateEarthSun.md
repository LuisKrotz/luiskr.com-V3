[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/updates](../README.md) / updateEarthSun

```ts
function updateEarthSun(s, __namedParameters?): void
```

Defined in: [experiments/earth-playground/earth/runtime/updates.ts:222](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/experiments/earth-playground/earth/runtime/updates.ts#L222)

Sun-orbit tweaks — autoRotate flips the per-frame advance, speed scales
the .01 rad/frame increment, and angle repositions the sun on its orbit
circle (used by the playground to restore a persisted sun state).

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

### \_\_namedParameters?

#### autoRotate?

`boolean`

#### speed?

`number`

#### angle?

`number`

## Returns

`void`
