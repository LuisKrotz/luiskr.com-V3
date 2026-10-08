[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [experiments/earth-playground/space/wiring](../README.md) / startSpacePositionLoop

```ts
function startSpacePositionLoop(c): void;
```

Defined in: [experiments/earth-playground/space/wiring.ts:156](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/space/wiring.ts#L156)

Starts the rAF loop mirroring camera position/target into the panel
readout each frame — cheap textContent writes, skipped entirely while
the engine handle is absent. Cancels any previous loop first so remount
can't double-arm the RAF chain.

## Parameters

### c

[`SpacePlayground`](../../../SpacePlayground/classes/SpacePlayground.md)

The SpacePlayground element.

## Returns

`void`
