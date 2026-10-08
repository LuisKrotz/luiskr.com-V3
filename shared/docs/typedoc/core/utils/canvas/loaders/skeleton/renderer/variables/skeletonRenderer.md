[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/loaders/skeleton/renderer](../README.md) / skeletonRenderer

```ts
const skeletonRenderer: SkeletonRenderer;
```

Defined in: [core/utils/canvas/loaders/skeleton/renderer.ts:302](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/loaders/skeleton/renderer.ts#L302)

Shared renderer singleton — every skeleton layer borrows this one
context via acquire()/release() so the page never holds more than one
shimmer pipeline regardless of how many skeletons mount.
