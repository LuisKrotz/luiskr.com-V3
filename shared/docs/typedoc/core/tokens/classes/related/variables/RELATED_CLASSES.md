[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/related](../README.md) / RELATED\_CLASSES

```ts
const RELATED_CLASSES: Readonly<{
  RELATED_MOSAIC: "related-mosaic";
  RELATED_MOSAIC_ITEM: "related-mosaic-item";
  RELATED_MOSAIC_ITEM_FEATURED: "related-mosaic-item--featured";
  RELATED_MOSAIC_MEDIA: "related-mosaic-media";
  RELATED_MOSAIC_IMG: "related-mosaic-img";
  RELATED_MOSAIC_OVERLAY: "related-mosaic-overlay";
  RELATED_MOSAIC_INFO: "related-mosaic-info";
  RELATED_MOSAIC_TITLE: "related-mosaic-title";
  RELATED_MOSAIC_DESC: "related-mosaic-desc";
}>;
```

Defined in: [core/tokens/classes/related.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/related.ts#L14)

Frozen related class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
