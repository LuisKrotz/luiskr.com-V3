[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/data/component-keys](../README.md) / LEGAL\_COMPONENT\_KEYS

```ts
const LEGAL_COMPONENT_KEYS: Readonly<{
  LEGAL_LINKS: 'legal-footer.links'
}>
```

Defined in: [src/core/tokens/data/component-keys.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/data/component-keys.ts#L42)

Frozen legal component key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
