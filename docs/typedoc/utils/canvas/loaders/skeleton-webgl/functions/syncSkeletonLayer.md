[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [utils/canvas/loaders/skeleton-webgl](../README.md) / syncSkeletonLayer

```ts
function syncSkeletonLayer(component): void
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:328](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/loaders/skeleton-webgl.ts#L328)

Keeps a component's skeleton layer in sync with its rendered content.
Call from onUpdated()/onMounted(): creates the layer while skeleton nodes
exist, re-measures after every render, resolves it once they are gone.

## Parameters

### component

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md)

The host component whose content is being watched.

## Returns

`void`
