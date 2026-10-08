[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / startConvert

```ts
function startConvert(host): Promise<void>;
```

Defined in: [cms/media-convert/job.ts:77](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/job.ts#L77)

Kicks off the server-side conversion and starts the poll loop. A 202
counts as success (job accepted, still queueing); any other failure
throws.

## Parameters

### host

[`CmsMediaConverter`](../../CmsMediaConverter/classes/CmsMediaConverter.md)

The CmsMediaConverter element.

## Returns

`Promise`\<`void`\>

## Throws

Error when the server refuses to start the conversion.
