[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/menu-background/loop](../README.md) / animateReveal

```ts
function animateReveal(host, target, dur): void
```

Defined in: [src/utils/canvas/loaders/menu-background/loop.ts:78](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/menu-background/loop.ts#L78)

Starts (or restarts mid-flight) a timed reveal ease. Capturing the
current value as `_revealFrom` means an open→close→open sequence
reverses from wherever the field is, with no jump.

## Parameters

### host

[`MenuBackgroundWebGL`](../../../menu-background-webgl/classes/MenuBackgroundWebGL.md)

### target

`number`

### dur

`number`

## Returns

`void`
