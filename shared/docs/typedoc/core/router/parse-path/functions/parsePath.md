[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/router/parse-path](../README.md) / parsePath

```ts
function parsePath(pathname): RouteDescriptor;
```

Defined in: [core/router/parse-path.ts:89](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/parse-path.ts#L89)

Pure resolution: pathname → route descriptor { name, view, lang,
path, meta, params }. meta.scrollTo triggers a post-nav smooth-scroll
to that element id.

## Parameters

### pathname

`string`

## Returns

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)
