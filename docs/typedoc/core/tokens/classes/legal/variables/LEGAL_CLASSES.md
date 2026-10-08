[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/classes/legal](../README.md) / LEGAL\_CLASSES

```ts
const LEGAL_CLASSES: Readonly<{
  LEGAL: 'legal'
}>
```

Defined in: [core/tokens/classes/legal.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/classes/legal.ts#L14)

Frozen legal class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
