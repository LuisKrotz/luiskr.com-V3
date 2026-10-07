[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [utils/canvas/loaders/skeleton-webgl](../README.md) / destroySkeletonLayer

```ts
function destroySkeletonLayer(component): void
```

Defined in: [src/utils/canvas/loaders/skeleton-webgl.ts:364](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/loaders/skeleton-webgl.ts#L364)

Component-unmount teardown — destroys the layer immediately (no
resolve-out: the host is going away, so a fade would never be seen) and
clears the component's reference.

## Parameters

### component

[`BaseComponent`](../../../../../core/Component/classes/BaseComponent.md)

The host component being unmounted.

## Returns

`void`
