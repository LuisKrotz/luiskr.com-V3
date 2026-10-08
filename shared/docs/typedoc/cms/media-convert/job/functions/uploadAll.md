[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / uploadAll

```ts
function uploadAll(host): Promise<void>;
```

Defined in: [cms/media-convert/job.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/job.ts#L49)

PUTs every queued file sequentially — the dev server is single-purpose
and serial uploads keep progress (`host.uploaded`) truthful. Re-renders
after each file so the progress counter animates live.

## Parameters

### host

[`CmsMediaConverter`](../../CmsMediaConverter/classes/CmsMediaConverter.md)

The CmsMediaConverter element.

## Returns

`Promise`\<`void`\>

## Throws

Error naming the failed file when a PUT is rejected.
