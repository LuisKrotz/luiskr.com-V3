[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/media](../README.md) / isGravatarUrl

```ts
function isGravatarUrl(urlStr): boolean
```

Defined in: [src/core/utils/media.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/utils/media.ts#L37)

Checks if a given URL belongs to gravatar.com (exact host or any
subdomain like `secure.gravatar.com`). Non-Gravatar URLs must not get
`size=` rewrites — that param is Gravatar-specific.

## Parameters

### urlStr

`string`

## Returns

`boolean`
