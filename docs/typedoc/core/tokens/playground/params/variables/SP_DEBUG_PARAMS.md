[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/playground/params](../README.md) / SP\_DEBUG\_PARAMS

```ts
const SP_DEBUG_PARAMS: Readonly<{
  RES_SCALE: 'res-scale'
  SHOW_STATS: 'show-stats'
}>
```

Defined in: [core/tokens/playground/params.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/playground/params.ts#L68)

Frozen sp debug parameter map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
