[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/tokens/primitives](../README.md) / MEDIA\_QUERIES

```ts
const MEDIA_QUERIES: Readonly<{
  POINTER_FINE: '(pointer: fine)'
  POINTER_COARSE: '(pointer: coarse)'
  MAX_WIDTH_768: '(max-width: 768px)'
  PREFERS_COLOR_DARK: '(prefers-color-scheme: dark)'
  PREFERS_REDUCED_MOTION: '(prefers-reduced-motion: reduce)'
}>
```

Defined in: [src/core/tokens/primitives.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/primitives.ts#L33)

Frozen media media-query map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
