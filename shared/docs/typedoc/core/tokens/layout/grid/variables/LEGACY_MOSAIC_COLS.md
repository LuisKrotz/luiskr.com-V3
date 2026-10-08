[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/layout/grid](../README.md) / LEGACY\_MOSAIC\_COLS

```ts
const LEGACY_MOSAIC_COLS: Readonly<{
  0: 1;
  540: 2;
  960: 3;
  1440: 4;
  1920: 5;
  2100: 6;
  2560: 7;
}>;
```

Defined in: [core/tokens/layout/grid.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/layout/grid.ts#L58)

Legacy stepped column table consumed by calcColsForWidth — predates
MOSAIC_COLS (which caps at 14 cols and starts the wide jumps earlier).
Kept as data so the function shares `_resolveBreakpoint` instead of a
ternary chain; keys are viewport widths, values are column counts.
