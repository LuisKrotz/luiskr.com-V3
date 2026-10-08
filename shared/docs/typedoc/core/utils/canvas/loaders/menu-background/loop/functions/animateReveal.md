[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/loaders/menu-background/loop](../README.md) / animateReveal

```ts
function animateReveal(
   host, 
   target, 
   dur
): void;
```

Defined in: [core/utils/canvas/loaders/menu-background/loop.ts:79](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/menu-background/loop.ts#L79)

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
