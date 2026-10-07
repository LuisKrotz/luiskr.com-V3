[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/media/figure/load](../README.md) / resolveMediaSources

```ts
function resolveMediaSources(fig): void
```

Defined in: [src/components/media/figure/load.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/media/figure/load.ts#L24)

Builds the media's CDN URL matrix on init: [poster, mp4] per tier for
videos (full size + VIDEO_SCALE'd fallback — the browser picks the
first playable <source>), or the thumb URL for images.

## Parameters

### fig

[`MediaFigure`](../../../MediaFigure/classes/MediaFigure.md)

## Returns

`void`
