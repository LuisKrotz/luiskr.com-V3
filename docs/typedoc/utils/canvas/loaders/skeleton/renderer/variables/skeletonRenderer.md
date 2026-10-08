[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/skeleton/renderer](../README.md) / skeletonRenderer

```ts
const skeletonRenderer: SkeletonRenderer
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:302](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/canvas/loaders/skeleton/renderer.ts#L302)

Shared renderer singleton — every skeleton layer borrows this one
context via acquire()/release() so the page never holds more than one
shimmer pipeline regardless of how many skeletons mount.
