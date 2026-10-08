[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/media](../README.md) / getGravatarSrcset

```ts
function getGravatarSrcset(urlStr): string;
```

Defined in: [core/utils/media.ts:72](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/media.ts#L72)

Builds responsive Gravatar srcset with 1x, 2x, 3x density descriptors —
200/300/400 px variants chosen by GRAVATAR_SIZE_*. Any existing `size=`
param is stripped first so the rewrite is idempotent; `sep` picks `?` or
`&` depending on whether other query params remain (stripping `size=`
may have consumed the `?`).

## Parameters

### urlStr

`string`

Gravatar URL to expand.

## Returns

`string`

srcset string, or '' for non-Gravatar input.
