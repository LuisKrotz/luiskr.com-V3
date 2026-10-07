[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/updates](../README.md) / updateEarthVignette

```ts
function updateEarthVignette(s, __namedParameters?): void
```

Defined in: [src/playground/earth/runtime/updates.ts:153](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/updates.ts#L153)

Vignette tweaks — enabled collapses darkness to 0 (same zero-cost
toggle pattern as bloom).
darkness - exponent + lerp weight of the falloff
offset - radial distance scale before the falloff

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

### \_\_namedParameters?

#### enabled?

`boolean`

#### darkness?

`number`

#### offset?

`number`

## Returns

`void`
