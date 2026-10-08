[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [core/safari/patches/media-figure/image-load](../README.md) / bindSafariImageLoad

```ts
function bindSafariImageLoad(
   el, 
   fig, 
   isHero
): void;
```

Defined in: [core/safari/patches/media-figure/image-load.ts:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/safari/patches/media-figure/image-load.ts#L83)

Lazy-thumbnail + img-observer wiring for non-hero images: the thumb
defers via loading=lazy and the Q50 swap triggers once the figure
scrolls within ROOT_MARGIN_50 of the viewport.

## Parameters

### el

[`SafariPatchableEl`](../../../../types/interfaces/SafariPatchableEl.md)

### fig

`Element` \| `null`

### isHero

`boolean`

## Returns

`void`
