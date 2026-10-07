[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/attrs/common](../README.md) / COMMON\_ATTRS

```ts
const COMMON_ATTRS: Readonly<{
  CLASS: 'class'
  CLASS_NAME: 'className'
  ID: 'id'
  STYLE: 'style'
  LANG: 'lang'
  DEFAULT_LANG: 'en'
  OPEN: 'open'
  HIDDEN: 'hidden'
  VISIBLE: 'visible'
  PROP: 'prop'
  SECTION: 'section'
  PX: 'px'
  DELAY: 'delay'
  OFFSET: 'offset'
  CLASSES: 'classes'
  TRIGGER: 'trigger'
  TRIGGER_VIEWPORT: 'viewport'
  TOUCH: 'touch'
  POINTER: 'pointer'
  FIT: 'fit'
}>
```

Defined in: [src/core/tokens/attrs/common.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/attrs/common.ts#L18)

Frozen common attribute-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
