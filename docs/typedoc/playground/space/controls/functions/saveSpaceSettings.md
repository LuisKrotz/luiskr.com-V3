[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/controls](../README.md) / saveSpaceSettings

```ts
function saveSpaceSettings(settings): void
```

Defined in: [src/playground/space/controls.ts:433](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/space/controls.ts#L433)

Persists the panel settings as a {_v, settings} blob — the version tag
lets loadSpaceSettings reject blobs written by a different schema.
Quota/security failures are swallowed: the panel works fine session-only.

## Parameters

### settings

[`SpSavedSettings`](../type-aliases/SpSavedSettings.md)

The full param → value map.

## Returns

`void`
