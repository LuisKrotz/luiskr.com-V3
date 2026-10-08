[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/loaders/skeleton-webgl](../README.md) / destroySkeletonLayer

```ts
function destroySkeletonLayer(component): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:364](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L364)

Component-unmount teardown — destroys the layer immediately (no
resolve-out: the host is going away, so a fade would never be seen) and
clears the component's reference.

## Parameters

### component

[`BaseComponent`](../../../../../Component/classes/BaseComponent.md)

The host component being unmounted.

## Returns

`void`
