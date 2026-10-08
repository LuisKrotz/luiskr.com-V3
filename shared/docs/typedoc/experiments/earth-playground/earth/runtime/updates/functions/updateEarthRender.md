[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/runtime/updates](../README.md) / updateEarthRender

```ts
function updateEarthRender(s, __namedParameters?): void;
```

Defined in: [experiments/earth-playground/earth/runtime/updates.ts:193](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/updates.ts#L193)

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
