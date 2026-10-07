[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/media/dimensions](../README.md) / VIDEO\_DIMENSIONS

```ts
const VIDEO_DIMENSIONS: Readonly<{
  VIDEO_DEFAULT_WIDTH: 640
  VIDEO_DEFAULT_HEIGHT: 360
}>
```

Defined in: [src/core/tokens/media/dimensions.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/media/dimensions.ts#L47)

Frozen video dimension map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
