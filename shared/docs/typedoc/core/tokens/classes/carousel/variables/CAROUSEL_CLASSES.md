[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/carousel](../README.md) / CAROUSEL\_CLASSES

```ts
const CAROUSEL_CLASSES: Readonly<{
  CAROUSEL: "carousel";
  CAROUSEL_CONTAINER: "carousel-container";
  CAROUSEL_TRACK: "carousel-track";
  CAROUSEL_SLIDE: "carousel-slide";
  CAROUSEL_SLIDE_ACTIVE: "carousel-slide--active";
  CAROUSEL_PREV: "carousel-prev";
  CAROUSEL_NEXT: "carousel-next";
  CAROUSEL_DOTS: "carousel-dots";
  CAROUSEL_DOT: "carousel-dot";
  CAROUSEL_DOT_ACTIVE: "carousel-dot--active";
  CAROUSEL_IN_VIEW: "carousel--in-view";
  CAROUSEL_FALLBACK: "carousel-fallback";
  CAROUSEL_FALLBACK_SIDE: "carousel-fallback carousel-fallback--side";
  CAROUSEL_CONTROLS: "carousel-controls";
  CAROUSEL_INDICATORS: "carousel-indicators";
  CAROUSEL_COUNTER: "carousel-counter";
  CAROUSEL_BTN: "carousel-btn";
  CAROUSEL_BTN_PREV: "carousel-btn carousel-btn--prev";
  CAROUSEL_BTN_NEXT: "carousel-btn carousel-btn--next";
  CAROUSEL_BTN_RING: "carousel-btn-ring";
  CAROUSEL_BTN_RING_TRACK: "carousel-btn-ring-track";
  CAROUSEL_BTN_RING_FILL: "carousel-btn-ring-fill";
  CAROUSEL_BTN_ARROW: "carousel-btn-arrow";
  CAROUSEL_BTN_CANVAS: "carousel-btn-canvas";
  CAROUSEL_SLIDE_CLONE: "carousel-slide carousel-slide--clone";
  CAROUSEL_SLIDE_CLONE_LAST: "carousel-slide carousel-slide--clone carousel-slide--clone-last";
  CAROUSEL_SLIDE_CLONE_FIRST: "carousel-slide carousel-slide--clone carousel-slide--clone-first";
}>;
```

Defined in: [core/tokens/classes/carousel.ts:21](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/carousel.ts#L21)

Frozen carousel class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
