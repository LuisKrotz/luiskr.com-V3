[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/controls](../README.md) / SP\_DB\_DEFAULT\_SEED

```ts
const SP_DB_DEFAULT_SEED: Record<string, number | boolean>
```

Defined in: [src/playground/space/controls.ts:319](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/space/controls.ts#L319)

Label-keyed seed for the CMS-managed `earth-playground/defaults` node —
`{ waterMetalness: 0, bumpScale: 5, … }`. The CMS prefills its defaults
card from this map when the DB node is absent so the editor always
shows the real shipped values instead of claiming none exist.
