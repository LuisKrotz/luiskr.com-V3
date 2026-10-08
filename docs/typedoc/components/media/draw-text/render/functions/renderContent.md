[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/media/draw-text/render](../README.md) / renderContent

```ts
function renderContent(text, delay, offset, withChars?): string
```

Defined in: [website/components/media/draw-text/render.ts:228](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/media/draw-text/render.ts#L228)

Full pipeline: text → tokens → HTML string. The `wi` closure counter
assigns each rendered word a sequential index so the word-level
cascade (`--wi`/`--word-delay`) staggers in reading order, including
words nested inside tags. Empty input returns "" rather than a stub
span tree.

## Parameters

### text

`string`

Raw text (may contain <br> and inline tags).

### delay

`number`

Per-char stagger delay in ms.

### offset

`number`

Base delay offset in ms.

### withChars?

`boolean` = `true`

Whether to emit per-char spans (false = plain text).

## Returns

`string`

The assembled HTML string.
