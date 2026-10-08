[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/home/mosaic/interactions](../README.md) / onClick

```ts
function onClick(
   host, 
   item, 
   i
): void;
```

Defined in: [website/components/home/mosaic/interactions.ts:141](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/home/mosaic/interactions.ts#L141)

Card activation. Desktop: straight to the project route. Touch:
first tap expands the details (records bottomH so the wall reflows),
second tap on the SAME card navigates — the two-tap pattern gives
touch users the hover preview desktop users get for free.

## Parameters

### host

[`HomeMosaic`](../../../HomeMosaic/classes/HomeMosaic.md)

### item

[`MosaicItem`](../../pack/interfaces/MosaicItem.md)

### i

`number`

## Returns

`void`
