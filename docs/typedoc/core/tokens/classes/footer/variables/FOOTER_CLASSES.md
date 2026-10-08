[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/classes/footer](../README.md) / FOOTER\_CLASSES

```ts
const FOOTER_CLASSES: Readonly<{
  FOOTER_SOURCE: 'footer-source'
  FOOTER_SOURCE_LINK: 'footer-source-link'
}>
```

Defined in: [core/tokens/classes/footer.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/classes/footer.ts#L14)

Frozen footer class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
