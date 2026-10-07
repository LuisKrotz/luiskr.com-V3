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

Defined in: [src/components/home/mosaic/pack.ts:138](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/home/mosaic/pack.ts#L138)

Full packing pass: returns per-card style objects + packed height.
`bottomHFor(i)` supplies the expanded details height (0 when closed).

## Parameters

### vw

`number`

### items

[`MosaicItem`](../interfaces/MosaicItem.md)[]

### bottomHFor

(`_i`) => `number`

## Returns

\| \{
`cards`: [`MosaicCardStyle`](../interfaces/MosaicCardStyle.md)[];
`height`: `number`;
\}
\| `null`
