[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/media](../README.md) / isGravatarUrl

```ts
function isGravatarUrl(urlStr): boolean;
```

Defined in: [core/utils/media.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/media.ts#L45)

Checks if a given URL belongs to gravatar.com (exact host or any
subdomain like `secure.gravatar.com`). Non-Gravatar URLs must not get
`size=` rewrites — that param is Gravatar-specific. `new URL` throws on
malformed input and relative URLs without a base — the try/catch maps
both to `false` (not-Gravatar) since either case is unrewritable anyway.

## Parameters

### urlStr

`string`

Candidate URL (absolute or relative).

## Returns

`boolean`

Whether the host is gravatar.com or a subdomain.
