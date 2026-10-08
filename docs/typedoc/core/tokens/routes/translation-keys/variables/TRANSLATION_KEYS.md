[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/routes/translation-keys](../README.md) / TRANSLATION\_KEYS

```ts
const TRANSLATION_KEYS: Readonly<{
  HOME: 'HOME'
  PRIVACY_POLICY: 'privacy-policy'
  GDPR: 'GDPR'
  TERMS_OF_USE: 'terms-of-use'
  NOT_FOUND: 'not-found'
  ABOUT: 'about'
  EARTH_PLAYGROUND: 'earth-playground'
}>
```

Defined in: [core/tokens/routes/translation-keys.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/routes/translation-keys.ts#L14)

Frozen translation key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
