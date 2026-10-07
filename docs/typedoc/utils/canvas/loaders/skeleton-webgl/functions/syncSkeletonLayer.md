[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [utils/canvas/loaders/skeleton-webgl](../README.md) / syncSkeletonLayer

```ts
function syncSkeletonLayer(component): void
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:276](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/loaders/skeleton-webgl.ts#L276)

Keeps a component's skeleton layer in sync with its rendered content.
Call from onUpdated()/onMounted(): creates the layer while skeleton nodes
exist, re-measures after every render, resolves it once they are gone.

## Parameters

### component

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md)

## Returns

`void`
