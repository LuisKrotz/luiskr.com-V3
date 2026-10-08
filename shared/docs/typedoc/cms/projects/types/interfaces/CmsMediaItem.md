[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/projects/types](../README.md) / CmsMediaItem

Defined in: [cms/projects/types.ts:10](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/projects/types.ts#L10)

One media row in the CMS project editor.

## Properties

### src

```ts
src: string;
```

Defined in: [cms/projects/types.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/projects/types.ts#L12)

Extensionless CDN stem (resolved by the gcs() helper for previews).

***

### label

```ts
label: string;
```

Defined in: [cms/projects/types.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/projects/types.ts#L14)

Alt/label text shown in the editor + emitted as media labels.

***

### isVideo

```ts
isVideo: boolean;
```

Defined in: [cms/projects/types.ts:16](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/projects/types.ts#L16)

Whether the media is a video (drives poster-URL resolution).

***

### size

```ts
size: number[];
```

Defined in: [cms/projects/types.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/projects/types.ts#L18)

Intrinsic [w,h] for aspect-ratio layouts.
