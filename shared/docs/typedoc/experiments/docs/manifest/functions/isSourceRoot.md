[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/manifest](../README.md) / isSourceRoot

```ts
function isSourceRoot(rootName): boolean;
```

Defined in: [experiments/docs/manifest.ts:73](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/manifest.ts#L73)

Whether a manifest root name ('src', 'core', …) is a protected source
bucket — source roots get the copy-guard and never auto-open index.html.

## Parameters

### rootName

`string`

First segment of a docs path or file id.

## Returns

`boolean`

True when the bucket's kind is 'source'.
