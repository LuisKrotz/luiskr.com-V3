[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/media](../README.md) / isGravatarUrl

```ts
function isGravatarUrl(urlStr): boolean
```

Defined in: [src/core/utils/media.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/utils/media.ts#L45)

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
