[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/home/mosaic/layout](../README.md) / quickLayout

```ts
function quickLayout(host): void;
```

Defined in: [website/components/home/mosaic/layout.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/home/mosaic/layout.ts#L42)

Synchronous layout pass for urgent repaints. Same packing math as
layout() but skips the WASM round-trip so the DOM never waits on a
worker. See layout() for the packing geometry notes.

## Parameters

### host

[`HomeMosaic`](../../../HomeMosaic/classes/HomeMosaic.md)

## Returns

`void`
