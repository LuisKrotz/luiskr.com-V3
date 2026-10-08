[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/routes/translation-keys](../README.md) / TRANSLATION\_KEYS

```ts
const TRANSLATION_KEYS: Readonly<{
  HOME: "HOME";
  PRIVACY_POLICY: "privacy-policy";
  GDPR: "GDPR";
  TERMS_OF_USE: "terms-of-use";
  NOT_FOUND: "not-found";
  ABOUT: "about";
  EARTH_PLAYGROUND: "earth-playground";
  DOCS: "docs";
}>;
```

Defined in: [core/tokens/routes/translation-keys.ts:21](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/routes/translation-keys.ts#L21)

Frozen translation key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
