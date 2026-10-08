[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / run

```ts
function run(host): Promise<void>;
```

Defined in: [cms/media-convert/job.ts:215](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/job.ts#L215)

Full pipeline orchestrator: create → upload → convert, flipping
host.phase at each stage and re-rendering. Errors land on the ERROR
phase with the server's message so the UI shows the real failure.

## Parameters

### host

[`CmsMediaConverter`](../../CmsMediaConverter/classes/CmsMediaConverter.md)

The CmsMediaConverter element.

## Returns

`Promise`\<`void`\>
