[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/space/boot](../README.md) / applyPersistedSettings

```ts
function applyPersistedSettings(c): void;
```

Defined in: [experiments/earth-playground/space/boot.ts:104](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/boot.ts#L104)

Replays the persisted settings object onto the live engine and panel:
each saved param runs through PARAM_HANDLERS (the same dispatch live
edits use), then the matching DOM input's value/checked + slider
track-fill + row label are synced so the panel reflects restored state.

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

## Returns

`void`
