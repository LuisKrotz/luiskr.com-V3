[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/suffixes](../README.md) / MEDIA

```ts
const MEDIA: Readonly<{
  MOZ: "-mozjpg";
  THUMB_SUFFIX: "3-MSSIM-tuned-kodak";
  Q50: "-50";
  Q100: "-uncompressed";
  EXT: ".jpg";
  VIDEO_EXT: ".mp4";
  VIDEO_THUMB_EXT: ".mp4.jpg-thumb.jpg";
  VIDEO_SCALE: ".mp4-scaledown-2x";
}>;
```

Defined in: [core/tokens/media/suffixes.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/suffixes.ts#L13)

Media asset filename-suffix tokens. All suffixes match the exact Firebase Storage naming convention used by the Kodak MSSIM blur-up pipeline and mozjpeg encoding passes. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
