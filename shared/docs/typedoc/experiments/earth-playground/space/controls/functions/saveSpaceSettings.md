[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/space/controls](../README.md) / saveSpaceSettings

```ts
function saveSpaceSettings(settings): void;
```

Defined in: [experiments/earth-playground/space/controls.ts:433](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/controls.ts#L433)

Persists the panel settings as a {_v, settings} blob — the version tag
lets loadSpaceSettings reject blobs written by a different schema.
Quota/security failures are swallowed: the panel works fine session-only.

## Parameters

### settings

[`SpSavedSettings`](../type-aliases/SpSavedSettings.md)

The full param → value map.

## Returns

`void`
