[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/manifest](../README.md) / fetchDocsFile

```ts
function fetchDocsFile(id): Promise<DocsFilePayload | null>;
```

Defined in: [experiments/docs/manifest.ts:155](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/manifest.ts#L155)

Lazily fetches one rendered file payload. Ids come straight from the
manifest, so the URL is encoded segment-wise — never user-derived.

## Parameters

### id

`string`

Manifest file id ('<root>:<relpath>').

## Returns

`Promise`\<[`DocsFilePayload`](../interfaces/DocsFilePayload.md) \| `null`\>

Parsed payload, or null on 404/network failure.
