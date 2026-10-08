[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/runtime/updates](../README.md) / updateEarthVignette

```ts
function updateEarthVignette(s, __namedParameters?): void;
```

Defined in: [experiments/earth-playground/earth/runtime/updates.ts:153](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/updates.ts#L153)

Vignette tweaks — enabled collapses darkness to 0 (same zero-cost
toggle pattern as bloom).
  darkness - exponent + lerp weight of the falloff
  offset   - radial distance scale before the falloff

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
