[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/projects/types](../README.md) / CmsMediaItem

Defined in: [src/cms/projects/types.ts:10](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L10)

One media row in the CMS project editor.

## Properties

### src

```ts
src: string
```

Defined in: [src/cms/projects/types.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L12)

Extensionless CDN stem (resolved by the gcs() helper for previews).

---

### label

```ts
label: string
```

Defined in: [src/cms/projects/types.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L14)

Alt/label text shown in the editor + emitted as media labels.

---

### isVideo

```ts
isVideo: boolean
```

Defined in: [src/cms/projects/types.ts:16](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L16)

Whether the media is a video (drives poster-URL resolution).

---

### size

```ts
size: number[];
```

Defined in: [src/cms/projects/types.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/projects/types.ts#L18)

Intrinsic [w,h] for aspect-ratio layouts.
