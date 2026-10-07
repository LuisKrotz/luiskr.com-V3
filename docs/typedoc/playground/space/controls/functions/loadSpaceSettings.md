[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/controls](../README.md) / loadSpaceSettings

```ts
function loadSpaceSettings(): SpSavedSettings | null
```

Defined in: [src/playground/space/controls.ts:394](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/space/controls.ts#L394)

Reads the persisted panel settings, discarding blobs from another
SP_VERSION or corrupted JSON — both collapse to "no saved state".

## Returns

[`SpSavedSettings`](../type-aliases/SpSavedSettings.md) \| `null`
