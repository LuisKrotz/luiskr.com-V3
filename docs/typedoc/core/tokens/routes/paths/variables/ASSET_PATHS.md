[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/routes/paths](../README.md) / ASSET\_PATHS

```ts
const ASSET_PATHS: Readonly<{
  FLAGS_PREFIX: '/flags/'
  SVG_EXT: '.svg'
}>
```

Defined in: [core/tokens/routes/paths.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/routes/paths.ts#L60)

Frozen asset path map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
