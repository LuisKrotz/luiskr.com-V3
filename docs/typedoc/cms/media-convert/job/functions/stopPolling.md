[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / stopPolling

```ts
function stopPolling(host): void
```

Defined in: [src/cms/media-convert/job.ts:22](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/media-convert/job.ts#L22)

Cancels the pending poll timer — called before every new poll schedule
and on reset so only one timer is ever armed.

## Parameters

### host

[`CmsMediaConverter`](../../CmsMediaConverter/classes/CmsMediaConverter.md)

The CmsMediaConverter element.

## Returns

`void`
