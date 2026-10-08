[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/media/draw-text/render](../README.md) / renderWordHtml

```ts
function renderWordHtml(
   chars?, 
   wordIdx, 
   delay, 
   offset, 
   withChars
): string;
```

Defined in: [website/components/media/draw-text/render.ts:193](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/draw-text/render.ts#L193)

Renders one word token's char spans. Exported so the char/offset math and
the empty-chars default are unit-testable — renderContent binds the running
word index `wi` via the closure below.

## Parameters

### chars?

[`DrawChar`](../../types/interfaces/DrawChar.md)[] = `[]`

Char tokens (each carries the global `--i` stagger index).

### wordIdx

`number`

Running word index — feeds the `--wi` per-word cascade.

### delay

`number`

Per-char delay in ms (written to `--char-delay`).

### offset

`number`

Base offset in ms (written to `--offset`).

### withChars

`boolean`

false → emit plain word text (pre/post-anim state).

## Returns

`string`

The word's `<span>` HTML.
