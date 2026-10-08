[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/dimensions](../README.md) / SCROLL\_TIMINGS

```ts
const SCROLL_TIMINGS: Readonly<{
  SCROLL_DURATION_FULL: 1000;
  SCROLL_DURATION_REDUCED: 2500;
  SCROLL_INIT_DELAY: 500;
}>;
```

Defined in: [core/tokens/media/dimensions.ts:112](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/dimensions.ts#L112)

Frozen scroll-timing map (ms) — `SCROLL_DURATION_FULL` paces animated
page scrolls, `SCROLL_DURATION_REDUCED` is the slower ramp under
prefers-reduced-motion (longer, gentler rather than instant so the jump
stays perceivable), `SCROLL_INIT_DELAY` defers scroll restoration until
after first paint settles.
