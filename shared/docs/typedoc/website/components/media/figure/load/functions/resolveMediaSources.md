[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/media/figure/load](../README.md) / resolveMediaSources

```ts
function resolveMediaSources(fig): void;
```

Defined in: [website/components/media/figure/load.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/figure/load.ts#L24)

Builds the media's CDN URL matrix on init: [poster, mp4] per tier for
videos (full size + VIDEO_SCALE'd fallback — the browser picks the
first playable <source>), or the thumb URL for images.

## Parameters

### fig

[`MediaFigure`](../../../MediaFigure/classes/MediaFigure.md)

## Returns

`void`
