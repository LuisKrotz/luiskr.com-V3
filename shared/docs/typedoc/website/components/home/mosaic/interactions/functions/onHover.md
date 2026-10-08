[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/home/mosaic/interactions](../README.md) / onHover

```ts
function onHover(host, i): void;
```

Defined in: [website/components/home/mosaic/interactions.ts:64](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/home/mosaic/interactions.ts#L64)

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
