[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/updates](../README.md) / updateEarthRender

```ts
function updateEarthRender(s, __namedParameters?): void
```

Defined in: [src/playground/earth/runtime/updates.ts:193](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/updates.ts#L193)

Resolution-scale multiplier (clamped ≤2) applied on top of
devicePixelRatio — the "render resolution" slider in the playground.
Triggers a resize so the new pixel ratio takes effect immediately.

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

### \_\_namedParameters?

#### resolutionScale?

`number`

## Returns

`void`
