[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/utils/canvas/loaders/skeleton-webgl](../README.md) / syncSkeletonLayer

```ts
function syncSkeletonLayer(component): void;
```

Defined in: [core/utils/canvas/loaders/skeleton-webgl.ts:328](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton-webgl.ts#L328)

Keeps a component's skeleton layer in sync with its rendered content.
Call from onUpdated()/onMounted(): creates the layer while skeleton nodes
exist, re-measures after every render, resolves it once they are gone.

## Parameters

### component

[`BaseComponent`](../../../../../Component/classes/BaseComponent.md)

The host component whose content is being watched.

## Returns

`void`
