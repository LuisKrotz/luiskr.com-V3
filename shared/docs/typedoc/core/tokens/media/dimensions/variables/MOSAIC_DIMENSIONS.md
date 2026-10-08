[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/dimensions](../README.md) / MOSAIC\_DIMENSIONS

```ts
const MOSAIC_DIMENSIONS: Readonly<{
  MOSAIC_DESKTOP_WIDTH: 1920;
  MOSAIC_MOBILE_WIDTH: 768;
  MOSAIC_DESKTOP_HEIGHT: 913;
  MOSAIC_MOBILE_HEIGHT: 340;
  MOSAIC_MOBILE_WIDTH_STR: "768";
  MOSAIC_DESKTOP_HEIGHT_STR: "913";
  MOSAIC_MOBILE_HEIGHT_STR: "340";
}>;
```

Defined in: [core/tokens/media/dimensions.ts:84](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/dimensions.ts#L84)

Frozen mosaic dimension map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
