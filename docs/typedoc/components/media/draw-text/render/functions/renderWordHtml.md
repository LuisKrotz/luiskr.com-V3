[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/media/draw-text/render](../README.md) / renderWordHtml

```ts
function renderWordHtml(chars?, wordIdx, delay, offset, withChars): string
```

Defined in: [src/components/media/draw-text/render.ts:184](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/media/draw-text/render.ts#L184)

Renders one word token's char spans. Exported so the char/offset math and
the empty-chars default are unit-testable — renderContent binds the running
word index `wi` via the closure below.

## Parameters

### chars?

[`DrawChar`](../../types/interfaces/DrawChar.md)[] = `[]`

### wordIdx

`number`

### delay

`number`

### offset

`number`

### withChars

`boolean`

## Returns

`string`
