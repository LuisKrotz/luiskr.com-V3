[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/selectors/mosaic](../README.md) / MOSAIC\_SELECTORS

```ts
const MOSAIC_SELECTORS: Readonly<{
  HOME_MOSAIC: '.home-mosaic'
  HOME_MOSAIC_ITEM: '.home-mosaic-item'
}>
```

Defined in: [core/tokens/selectors/mosaic.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/selectors/mosaic.ts#L13)

Frozen mosaic selector map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
