[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/carousel/custom-carousel/nav](../README.md) / carouselOnScroll

```ts
function carouselOnScroll(c): void;
```

Defined in: [website/components/carousel/custom-carousel/nav.ts:256](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/carousel/custom-carousel/nav.ts#L256)

Scroll handler — debounces SCROLL_DEBOUNCE_MS (150ms) then runs the
clone-teleport check. Skipped while isNavigating (a programmatic scroll
fires many scroll events; letting them trigger teleports would undo the
goTo-driven clone jump mid-animation).

## Parameters

### c

[`CustomCarousel`](../../../CustomCarousel/classes/CustomCarousel.md)

The CustomCarousel element.

## Returns

`void`
