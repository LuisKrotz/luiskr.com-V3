[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/manifest](../README.md) / fileIdRoot

```ts
function fileIdRoot(id): string;
```

Defined in: [experiments/docs/manifest.ts:81](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/manifest.ts#L81)

Extracts the root namespace from a manifest file id ('<root>:<rel>').

## Parameters

### id

`string`

Manifest file id.

## Returns

`string`

The root name, or '' when the id has no namespace.
