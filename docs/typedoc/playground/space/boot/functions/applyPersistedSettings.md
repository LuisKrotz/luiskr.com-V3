[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [playground/space/boot](../README.md) / applyPersistedSettings

```ts
function applyPersistedSettings(c): void
```

Defined in: [experiments/earth-playground/space/boot.ts:104](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/experiments/earth-playground/space/boot.ts#L104)

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
