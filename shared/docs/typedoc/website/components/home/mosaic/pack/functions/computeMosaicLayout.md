[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/home/mosaic/pack](../README.md) / computeMosaicLayout

```ts
function computeMosaicLayout(
   vw, 
   items, 
   bottomHFor
): 
  | {
  cards: MosaicCardStyle[];
  height: number;
}
  | null;
```

Defined in: [website/components/home/mosaic/pack.ts:173](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/home/mosaic/pack.ts#L173)

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
