[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/widgets/theme-slider/math](../README.md) / xToContinuousP

```ts
function xToContinuousP(
   host, 
   x, 
   rectWidth?
): number;
```

Defined in: [core/utils/canvas/widgets/theme-slider/math.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/theme-slider/math.ts#L54)

Pointer pixel X → continuous (unclamped-drag) normalized position.
The active band is the middle 76% of the canvas (12%–88%) — the
capsule's rounded ends are dead zone so a tap near the very edge
still snaps to the outermost stop instead of overshooting.

## Parameters

### host

[`ThemeSliderWebGL`](../../classes/ThemeSliderWebGL.md)

### x

`number`

### rectWidth?

`number` \| `null`

## Returns

`number`
