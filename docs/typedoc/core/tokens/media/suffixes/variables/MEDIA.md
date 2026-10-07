[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/media/suffixes](../README.md) / MEDIA

```ts
const MEDIA: Readonly<{
  MOZ: '-mozjpg'
  THUMB_SUFFIX: '3-MSSIM-tuned-kodak'
  Q50: '-50'
  Q100: '-uncompressed'
  EXT: '.jpg'
  VIDEO_EXT: '.mp4'
  VIDEO_THUMB_EXT: '.mp4.jpg-thumb.jpg'
  VIDEO_SCALE: '.mp4-scaledown-2x'
}>
```

Defined in: [src/core/tokens/media/suffixes.ts:8](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/tokens/media/suffixes.ts#L8)

## File

tokens/media/suffixes.js

## Description

Media asset filename-suffix tokens. All suffixes match the
exact Firebase Storage naming convention used by the Kodak MSSIM blur-up
pipeline and mozjpeg encoding passes.
