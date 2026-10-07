[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [safari/patches/media-figure/image-load](../README.md) / bindSafariImageLoad

```ts
function bindSafariImageLoad(el, fig, isHero): void
```

Defined in: [src/safari/patches/media-figure/image-load.ts:83](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/safari/patches/media-figure/image-load.ts#L83)

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
