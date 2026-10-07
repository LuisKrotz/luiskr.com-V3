[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/updates](../README.md) / updateEarthBloom

```ts
function updateEarthBloom(s, __namedParameters?): void
```

Defined in: [src/playground/earth/runtime/updates.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/updates.ts#L18)

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
