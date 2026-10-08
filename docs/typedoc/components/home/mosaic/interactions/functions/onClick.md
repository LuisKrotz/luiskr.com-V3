[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/home/mosaic/interactions](../README.md) / onClick

```ts
function onClick(host, item, i): void
```

Defined in: [website/components/home/mosaic/interactions.ts:141](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/home/mosaic/interactions.ts#L141)

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
