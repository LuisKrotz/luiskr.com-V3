[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/strings/dom](../README.md) / DOM\_STRINGS

```ts
const DOM_STRINGS: Readonly<{
  CLASS: 'class'
  CLASS_NAME: 'className'
  ID: 'id'
  SRC: 'src'
  HREF: 'href'
  ALT: 'alt'
  TYPE: 'type'
  NAME: 'name'
  VALUE: 'value'
  REL: 'rel'
  REL_CANONICAL: 'canonical'
  REL_PREFETCH: 'prefetch'
  BLANK: '_blank'
  NOOPENER: 'noopener noreferrer'
  DATA_ROUTE: 'data-route'
  A_TAG: 'a'
  BR_TAG: '<br>'
}>
```

Defined in: [src/core/tokens/strings/dom.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/strings/dom.ts#L14)

Frozen dom string map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
