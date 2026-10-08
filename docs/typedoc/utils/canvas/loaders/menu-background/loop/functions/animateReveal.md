[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/menu-background/loop](../README.md) / animateReveal

```ts
function animateReveal(host, target, dur): void
```

Defined in: [core/utils/canvas/loaders/menu-background/loop.ts:79](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/canvas/loaders/menu-background/loop.ts#L79)

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
