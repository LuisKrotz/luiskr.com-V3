[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/controls](../README.md) / loadSpaceSettings

```ts
function loadSpaceSettings(): SpSavedSettings | null
```

Defined in: [src/playground/space/controls.ts:413](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/space/controls.ts#L413)

Reads the persisted panel settings, discarding blobs from another
SP_VERSION or corrupted JSON — both collapse to "no saved state" so a
stale/corrupt blob can never apply out-of-range engine values.

## Returns

[`SpSavedSettings`](../type-aliases/SpSavedSettings.md) \| `null`

The saved param map, or null.
