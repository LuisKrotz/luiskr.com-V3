[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/manifest](../README.md) / crumbsForPath

```ts
function crumbsForPath(docsPath): object[];
```

Defined in: [experiments/docs/manifest.ts:137](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/manifest.ts#L137)

Breadcrumb segments for a resolved docs path — [{label, path}] from the
portal root down to the node.

## Parameters

### docsPath

`string`

Route param from /docs/<path>.

## Returns

`object`[]

Ordered crumb trail.
