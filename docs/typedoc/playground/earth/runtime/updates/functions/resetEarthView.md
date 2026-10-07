[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/updates](../README.md) / resetEarthView

```ts
function resetEarthView(s): void
```

Defined in: [src/playground/earth/runtime/updates.ts:255](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/updates.ts#L255)

Restore the default framing: OrbitControls.reset() replays saveState()
(captured at bootstrap), then fov/position/target are pinned to
DEFAULT_SP_GUI.CAMERA in case the saved state drifted.

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

## Returns

`void`
