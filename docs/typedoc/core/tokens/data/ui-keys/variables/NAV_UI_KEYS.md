[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/data/ui-keys](../README.md) / NAV\_UI\_KEYS

```ts
const NAV_UI_KEYS: Readonly<{
  SCROLL_UP: 'scrollup'
  PREFERENCES: 'preferences'
  LANGUAGE: 'language'
  MENU: 'menu'
  CLOSE: 'close'
  SITE_PREFERENCES: 'sitePreferences'
}>
```

Defined in: [src/core/tokens/data/ui-keys.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/data/ui-keys.ts#L39)

Frozen nav ui key map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
