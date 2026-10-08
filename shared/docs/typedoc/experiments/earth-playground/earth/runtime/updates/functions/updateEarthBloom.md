[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/runtime/updates](../README.md) / updateEarthBloom

```ts
function updateEarthBloom(s, __namedParameters?): void;
```

Defined in: [experiments/earth-playground/earth/runtime/updates.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/updates.ts#L18)

Live-tweak bloom. `enabled` collapses strength to 0 rather than
removing the pass — the node graph stays compiled, so toggling is
free (no shader rebuild).

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

### \_\_namedParameters?

#### enabled?

`boolean`

#### strength?

`number`

#### radius?

`number`

#### threshold?

`number`

## Returns

`void`
