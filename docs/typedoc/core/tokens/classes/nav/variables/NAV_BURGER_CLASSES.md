[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/classes/nav](../README.md) / NAV\_BURGER\_CLASSES

```ts
const NAV_BURGER_CLASSES: Readonly<{
  NAV_BURGER_BTN: 'nav-burger-btn'
  NAV_BURGER_OPEN: 'nav-burger--open'
  NAV_BURGER_CANVAS: 'nav-burger-canvas'
  NAV_BURGER_WRAP: 'nav-burger-wrap'
  NAV_BURGER_FALLBACK: 'nav-burger-fallback'
  NAV_BURGER_LINE: 'nav-burger-line'
}>
```

Defined in: [core/tokens/classes/nav.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/classes/nav.ts#L48)

Frozen nav burger class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
