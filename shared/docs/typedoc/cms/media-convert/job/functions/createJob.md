[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / createJob

```ts
function createJob(host): Promise<void>;
```

Defined in: [cms/media-convert/job.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/job.ts#L35)

POSTs an empty job to the dev server and stores the returned id on the
host — every subsequent request hangs off host.jobId.

## Parameters

### host

[`CmsMediaConverter`](../../CmsMediaConverter/classes/CmsMediaConverter.md)

The CmsMediaConverter element.

## Returns

`Promise`\<`void`\>

## Throws

Error with the server's message when the job can't be created.
