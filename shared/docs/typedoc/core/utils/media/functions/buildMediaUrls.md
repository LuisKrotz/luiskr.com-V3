[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/media](../README.md) / buildMediaUrls

```ts
function buildMediaUrls(
   storage, 
   folder, 
   item
): MediaUrls;
```

Defined in: [core/utils/media.ts:113](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/media.ts#L113)

Constructs media URLs for images and videos following the project's
compression pipeline. URL grammar:
  image source : storage + folder + src + '-mozjpg-uncompressed.jpg'   (full quality)
  image thumb  : storage + folder + src + '-mozjpg3-MSSIM-tuned-kodak.jpg' (blur-up)
  video source : storage + folder + src + '.mp4'
  video thumb  : storage + folder + src + '.mp4.jpg-thumb.jpg'         (poster frame)
`src` in the DB never carries an extension — the pipeline's suffix is
appended here, which is why an unsuffixed URL 404s.

## Parameters

### storage

`string`

Base storage URL (store.getters.getStorage())

### folder

`string`

Project folder prefix, e.g. 'aboutmarco/'

### item

[`MediaUrlItem`](../interfaces/MediaUrlItem.md) \| `null`

Media item descriptor `{ src, isVideo }`

## Returns

[`MediaUrls`](../interfaces/MediaUrls.md)
