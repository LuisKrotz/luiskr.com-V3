[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/home/mosaic/interactions](../README.md) / onHover

```ts
function onHover(host, i): void
```

Defined in: [src/components/home/mosaic/interactions.ts:64](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/home/mosaic/interactions.ts#L64)

Pointer-enter: expands the card's details region. Two-pass flow —
first layout() with a 130px provisional bottom, then after one frame
the real scrollHeight is measured into bottomHMap and the wall
reflows to its final geometry. npuPredict warms the likely route
(150ms debounce ≈ intentional hover vs cursor passing through).

## Parameters

### host

[`HomeMosaic`](../../../HomeMosaic/classes/HomeMosaic.md)

### i

`number`

## Returns

`void`
