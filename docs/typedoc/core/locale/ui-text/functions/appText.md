[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/locale/ui-text](../README.md) / appText

```ts
function appText(path): unknown
```

Defined in: [src/core/locale/ui-text.ts:34](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/locale/ui-text.ts#L34)

Resolves a UI string from the live APP dictionary (store.lang.app, loaded
from Firebase for the current locale) with the English snapshot as fallback.

## Parameters

### path

`string`

dotted path, e.g. 'media.preview' or 'pref.devTools.showGrid'

## Returns

`unknown`
