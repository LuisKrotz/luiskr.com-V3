[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/media/draw-text/render](../README.md) / parseTokens

```ts
function parseTokens(text): DrawToken[]
```

Defined in: [src/components/media/draw-text/render.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/media/draw-text/render.ts#L30)

Tokenizes the text into word/space/br/inline-tag chunks. Words split
at spaces and each character gets a global index `ci`. Spaces and
<br>s become layout-only tokens so line breaking stays identical to
unsplit text. The regex walks <br>, <tag>…</tag> (attrs preserved,
group 3 back-referenced for the closing tag), and bare text — so
inline markup inside CMS copy (e.g. an <em> or <a>) animates as one
continuous sequence.

## Parameters

### text

`string`

## Returns

[`DrawToken`](../../types/interfaces/DrawToken.md)[]
