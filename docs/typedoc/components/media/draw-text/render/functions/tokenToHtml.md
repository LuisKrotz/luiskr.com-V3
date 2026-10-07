[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/media/draw-text/render](../README.md) / tokenToHtml

```ts
function tokenToHtml(token, renderWord): string
```

Defined in: [src/components/media/draw-text/render.ts:169](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/render.ts#L169)

Top-level token → HTML: <br> and space become aria-hidden layout
nodes (the space gets a span so the flex/grid layout sees a real box),
words render animated chars, tags recurse. Unknown token types return
"" — forward-compatible for tokenizer additions.

## Parameters

### token

[`DrawToken`](../../types/interfaces/DrawToken.md)

The parsed token.

### renderWord

`RenderWord`

Word renderer bound to the current delay/offset.

## Returns

`string`

HTML string for the token.
