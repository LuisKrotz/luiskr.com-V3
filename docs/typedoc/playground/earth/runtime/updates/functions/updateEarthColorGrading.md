[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/updates](../README.md) / updateEarthColorGrading

```ts
function updateEarthColorGrading(s, __namedParameters?): void
```

Defined in: [src/playground/earth/runtime/updates.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/updates.ts#L46)

Live-tweak the color-grade node. Every arg mirrors straight into a TSL
uniform; see makePostNodes for the per-term math.
contrast - multiplier around mid-grey (1 = neutral)
saturation - lerp weight between luma and color
blackLevel - floor subtracted before output
blueGreenBoost - extra gain on G+B channels

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

### \_\_namedParameters?

#### contrast?

`number`

#### saturation?

`number`

#### blackLevel?

`number`

#### blueGreenBoost?

`number`

## Returns

`void`
