[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/schema](../README.md) / generateCarouselItemListSchema

```ts
function generateCarouselItemListSchema(items?, baseUrl?): Record<string, unknown> | null
```

Defined in: [core/utils/schema.ts:72](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/schema.ts#L72)

Generates an ItemList matching Google Carousel rich results guidelines —
`position` is 1-based per the spec, and `image` is only emitted when the
item carries a src (an absent property beats an empty one for parsers).

## Parameters

### items?

`CarouselSchemaItem`[] = `[]`

### baseUrl?

`string` = `NET_STRINGS.SITE_URL`

## Returns

`Record`\<`string`, `unknown`\> \| `null`

ItemList entity, or null when there is nothing to list.
