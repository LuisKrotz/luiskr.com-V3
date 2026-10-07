[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/string](../README.md) / stripHtml

```ts
function stripHtml(str): string
```

Defined in: [src/core/utils/string.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/utils/string.ts#L17)

Strips HTML tags iteratively to prevent malformed or nested tags from leaking.
A single `replace(/<[^>]*>/)` pass can leave a reconstructed tag behind
(input like `<scr<script>ipt>` collapses into `<script>`), so the loop
re-runs until the string is stable.
Pure ESM utility function, tree-shakeable.

## Parameters

### str

`string`

## Returns

`string`
