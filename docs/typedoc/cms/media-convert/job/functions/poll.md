[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / poll

```ts
function poll(host): Promise<void>
```

Defined in: [src/cms/media-convert/job.ts:93](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/media-convert/job.ts#L93)

One poll tick: fetches job status, re-arms the timer while the server
reports running/uploading, and finishes (or errors) on a terminal
state. A failed GET is treated as server loss — the phase flips to
ERROR rather than polling forever.

## Parameters

### host

[`CmsMediaConverter`](../../CmsMediaConverter/classes/CmsMediaConverter.md)

The CmsMediaConverter element.

## Returns

`Promise`\<`void`\>
