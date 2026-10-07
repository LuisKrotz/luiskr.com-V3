[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/playground/params](../README.md) / SP\_GRADE\_PARAMS

```ts
const SP_GRADE_PARAMS: Readonly<{
  CONTRAST: 'contrast'
  SATURATION: 'saturation'
  BLACK_LEVEL: 'black-level'
}>
```

Defined in: [src/core/tokens/playground/params.ts:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/playground/params.ts#L57)

Frozen sp grade parameter map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
