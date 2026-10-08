[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/home/mosaic/pack](../README.md) / packMosaicSkeleton

```ts
function packMosaicSkeleton(vw): object;
```

Defined in: [website/components/home/mosaic/pack.ts:214](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/home/mosaic/pack.ts#L214)

Skeleton variant: packs placeholder tiles (no items needed — featured
count + aspect cycle come from SKELETON/LAYOUT tokens) so the loading
wall matches the real geometry.

## Parameters

### vw

`number`

Viewport width.

## Returns

`object`

— empty boxes on degenerate grids.

### boxes

```ts
boxes: SkeletonBox[];
```

### height

```ts
height: number;
```
