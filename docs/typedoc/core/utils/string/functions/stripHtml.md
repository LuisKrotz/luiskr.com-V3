[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/string](../README.md) / stripHtml

```ts
function stripHtml(str): string
```

Defined in: [core/utils/string.ts:21](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/string.ts#L21)

Strips HTML tags iteratively to prevent malformed or nested tags from leaking.
A single `replace(/<[^>]*>/)` pass can leave a reconstructed tag behind
(input like `<scr<script>ipt>` collapses into `<script>`), so the loop
re-runs until the string is stable — this is the classic "iterated
sanitization" defense: each pass may expose a tag assembled from
fragments of the previous pass.
Pure ESM utility function, tree-shakeable.

## Parameters

### str

`string`

Raw markup-bearing text.

## Returns

`string`

Text with every `<…>` span removed.
