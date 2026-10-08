[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/nav](../README.md) / setupIntersectionObserver

```ts
function setupIntersectionObserver(c): void;
```

Defined in: [website/components/carousel/custom-carousel/nav.ts:356](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/nav.ts#L356)

IntersectionObserver wiring — entry: adds the in-view class and mounts
the WebGL arrows; exit: destroys the arrows (their GL contexts are
released offscreen — canvases are re-mounted on return, keeping total
live contexts bounded). `isFullyVisible` gates autoplay at
VISIBILITY_RATIO (15%): a partly-seen strip still animates, a sliver
doesn't burn frames. Threshold array [0, .15, .5, 1] gives both the
0-crossing and the gate crossing cleanly. No IntersectionObserver →
degrade to always-visible so content still shows.

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
