[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/locale/fallback](../README.md) / FALLBACK

```ts
const FALLBACK: Readonly<FallbackSnapshot>;
```

Defined in: [core/locale/fallback.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/locale/fallback.ts#L31)

English UI copy snapshotted from database.json at build time.
Components read live translations from the store first and fall back to
this snapshot, so no user-visible string lives in JavaScript source.
