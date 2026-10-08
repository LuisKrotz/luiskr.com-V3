[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/layout/grid](../README.md) / RESPONSIVE\_PADDING\_STEPS

```ts
const RESPONSIVE_PADDING_STEPS: Readonly<{
  0: 13;
  320: 21;
  540: 34;
  768: 55;
  1024: 89;
  1680: 144;
}>;
```

Defined in: [core/tokens/layout/grid.ts:82](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/layout/grid.ts#L82)

Fibonacci-scaled outer page padding per breakpoint — 13 up to 320,
then 21/34/55/89 and 144 at ≥1680. Consumed by calcResponsivePadding
via `_resolveBreakpoint`.
