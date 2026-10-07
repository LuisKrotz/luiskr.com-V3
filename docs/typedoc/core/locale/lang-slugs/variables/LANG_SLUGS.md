[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/locale/lang-slugs](../README.md) / LANG\_SLUGS

```ts
const LANG_SLUGS: Record<string, LangSlugMap>
```

Defined in: [src/core/locale/lang-slugs.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/locale/lang-slugs.ts#L30)

Localized route slugs per locale — the path segments after the locale
prefix. English is canonical/un-prefixed; every other locale maps its
routes through this table (`/br/sobre`, `/de/nutzungsbedingungen`, …).
CMS may override these at runtime via `translations/<loc>/slugs`.
