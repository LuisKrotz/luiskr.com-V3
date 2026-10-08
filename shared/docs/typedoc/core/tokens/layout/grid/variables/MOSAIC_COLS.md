[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/layout/grid](../README.md) / MOSAIC\_COLS

```ts
const MOSAIC_COLS: Readonly<{
  0: 1;
  540: 2;
  960: 3;
  1280: 4;
  1680: 5;
  1920: 6;
  2560: 7;
  3840: 8;
  5120: 10;
  7680: 12;
  10240: 14;
}>;
```

Defined in: [core/tokens/layout/grid.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/layout/grid.ts#L38)

Frozen mosaic map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
