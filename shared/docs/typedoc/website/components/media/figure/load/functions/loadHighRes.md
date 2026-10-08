[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/media/figure/load](../README.md) / loadHighRes

```ts
function loadHighRes(fig): Promise<void>;
```

Defined in: [website/components/media/figure/load.ts:72](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/figure/load.ts#L72)

Thumb → high-res swap. A detached Image preloads the Q50 variant;
on load the visible element swaps src + gets the loaded class (the
CSS crossfade) and the thumb hides. The 4096²-pixel budget caps decode
memory without rejecting tall, narrow full-page screenshots solely because
one dimension exceeds 4096px. Errors mark loaded anyway — a broken image
must not pin the skeleton shimmer forever.

## Parameters

### fig

[`MediaFigure`](../../../MediaFigure/classes/MediaFigure.md)

## Returns

`Promise`\<`void`\>
