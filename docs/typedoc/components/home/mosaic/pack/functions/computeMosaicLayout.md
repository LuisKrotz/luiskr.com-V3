[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/home/mosaic/pack](../README.md) / computeMosaicLayout

```ts
function computeMosaicLayout(
  vw,
  items,
  bottomHFor
): {
  cards: MosaicCardStyle[]
  height: number
} | null
```

Defined in: [src/components/home/mosaic/pack.ts:173](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/home/mosaic/pack.ts#L173)

Full packing pass: returns per-card style objects + packed height.
`bottomHFor(i)` supplies the expanded details height (0 when closed) —
the card GROWS the wall rather than overlaying so expanding a tile
reflows the cards below it. The container height subtracts the trailing
gap so it hugs the last tile.

## Parameters

### vw

`number`

Viewport width.

### items

[`MosaicItem`](../interfaces/MosaicItem.md)[]

The tile list.

### bottomHFor

(`_i`) => `number`

Expanded-bottom height lookup per index.

## Returns

\| \{
`cards`: [`MosaicCardStyle`](../interfaces/MosaicCardStyle.md)[];
`height`: `number`;
\}
\| `null`

or null for empty/degenerate grids.
