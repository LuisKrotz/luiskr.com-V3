[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/locale/fallback](../README.md) / FALLBACK

```ts
const FALLBACK: Readonly<FallbackSnapshot>
```

Defined in: [src/core/locale/fallback.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/locale/fallback.ts#L31)

English UI copy snapshotted from database.json at build time.
Components read live translations from the store first and fall back to
this snapshot, so no user-visible string lives in JavaScript source.
