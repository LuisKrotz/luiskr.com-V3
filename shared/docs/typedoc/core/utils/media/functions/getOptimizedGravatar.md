[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/media](../README.md) / getOptimizedGravatar

```ts
function getOptimizedGravatar(urlStr, size?): string;
```

Defined in: [core/utils/media.ts:90](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/media.ts#L90)

Replaces the `size=` parameter on a Gravatar URL. Non-Gravatar URLs pass
through unchanged (the param is meaningless off-domain), and a URL with
no `size=` is left alone since the regex finds no match.

## Parameters

### urlStr

`string`

Candidate Gravatar URL.

### size?

`number` = `300`

Pixel edge to request (default 300 — the rendered avatar box).

## Returns

`string`

Rewritten URL, original URL, or '' for non-string input.
