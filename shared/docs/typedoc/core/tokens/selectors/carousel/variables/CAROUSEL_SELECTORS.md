[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/selectors/carousel](../README.md) / CAROUSEL\_SELECTORS

```ts
const CAROUSEL_SELECTORS: Readonly<{
  CAROUSEL: ".carousel";
  CAROUSEL_TRACK: ".carousel-track";
  CAROUSEL_FALLBACK: ".carousel-fallback";
  CAROUSEL_BTN_PREV: ".carousel-btn--prev";
  CAROUSEL_BTN_NEXT: ".carousel-btn--next";
  CAROUSEL_BTN_CANVAS: ".carousel-btn-canvas";
  CAROUSEL_BTN_RING_FILL: ".carousel-btn-ring-fill";
  CAROUSEL_DOT: ".carousel-dot";
  CAROUSEL_COUNTER: ".carousel-counter";
  CAROUSEL_SLIDE_CLONE_FIRST: ".carousel-slide--clone-first";
  CAROUSEL_SLIDE_CLONE_LAST: ".carousel-slide--clone-last";
  CAROUSEL_SLIDES_NOT_CLONE: ".carousel-slide:not(.carousel-slide--clone)";
}>;
```

Defined in: [core/tokens/selectors/carousel.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/selectors/carousel.ts#L14)

Frozen carousel selector map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
