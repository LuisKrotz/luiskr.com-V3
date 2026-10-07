[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/classes/cookies](../README.md) / COOKIE\_CLASSES

```ts
const COOKIE_CLASSES: Readonly<{
  COOKIES: 'cookies'
  COOKIES_INFO: 'cookies-info'
  COOKIES_BUTTONS: 'cookies-buttons'
  COOKIES_BUTTONS_ACCEPT: 'cookies-buttons-accept'
  COOKIES_BUTTONS_REFUSE: 'cookies-buttons-refuse'
}>
```

Defined in: [src/core/tokens/classes/cookies.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/classes/cookies.ts#L13)

Frozen cookie class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
