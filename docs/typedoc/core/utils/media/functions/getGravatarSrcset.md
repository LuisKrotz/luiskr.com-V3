[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/media](../README.md) / getGravatarSrcset

```ts
function getGravatarSrcset(urlStr): string
```

Defined in: [src/core/utils/media.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/utils/media.ts#L61)

Builds responsive Gravatar srcset with 1x, 2x, 3x density descriptors —
200/300/400 px variants chosen by GRAVATAR_SIZE_*. Any existing `size=`
param is stripped first so the rewrite is idempotent; `sep` picks `?` or
`&` depending on whether other query params remain.

## Parameters

### urlStr

`string`

## Returns

`string`
