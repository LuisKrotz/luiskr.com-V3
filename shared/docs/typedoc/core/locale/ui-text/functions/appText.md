[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/locale/ui-text](../README.md) / appText

```ts
function appText(path): unknown;
```

Defined in: [core/locale/ui-text.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/locale/ui-text.ts#L41)

Resolves a UI string from the live APP dictionary (store.lang.app, loaded
from Firebase for the current locale) with the English snapshot as fallback.

## Parameters

### path

`string`

dotted path, e.g. 'media.preview' or 'pref.devTools.showGrid'

## Returns

`unknown`
