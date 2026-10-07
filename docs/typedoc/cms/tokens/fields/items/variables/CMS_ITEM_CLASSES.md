[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [cms/tokens/fields/items](../README.md) / CMS\_ITEM\_CLASSES

```ts
const CMS_ITEM_CLASSES: Readonly<{
  CMS_ITEM_CONTROLS: 'cms-item-controls'
  CMS_PARA_ITEM: 'cms-para-item'
  CMS_MEDIA_THUMB_PLACEHOLDER: 'cms-media-thumb-placeholder'
  CMS_DROPZONE: 'cms-dropzone'
  CMS_PROGRESS_FILL: 'cms-progress-fill'
  CMS_KV_LIST: 'cms-kv-list'
  CMS_KV_KEY: 'cms-kv-key'
  CMS_KV_ITEM: 'cms-kv-item'
}>
```

Defined in: [src/cms/tokens/fields/items.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/tokens/fields/items.ts#L14)

Frozen cms item class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
