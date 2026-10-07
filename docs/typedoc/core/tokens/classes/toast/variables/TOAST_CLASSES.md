[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/classes/toast](../README.md) / TOAST\_CLASSES

```ts
const TOAST_CLASSES: Readonly<{
  SITE_TOAST: 'site-toast'
  SITE_TOAST_ITEM: 'site-toast-item'
  SITE_TOAST_TITLE: 'site-toast-title'
  SITE_TOAST_TEXT: 'site-toast-text'
  SITE_TOAST_CLOSE: 'site-toast-close'
}>
```

Defined in: [src/core/tokens/classes/toast.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/classes/toast.ts#L14)

Frozen toast class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
