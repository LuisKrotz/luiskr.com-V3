[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/attrs/media](../README.md) / MEDIA\_ATTRS

```ts
const MEDIA_ATTRS: Readonly<{
  SRC: "src";
  ALT: "alt";
  POSTER: "poster";
  METADATA: "metadata";
  WIDTH: "width";
  HEIGHT: "height";
  SOURCE: "source";
  THUMB: "thumb";
  DECODING: "decoding";
  DECODING_ASYNC: "async";
  DECODING_SYNC: "sync";
  LOADING: "loading";
  LOADING_LAZY: "lazy";
  LOADING_EAGER: "eager";
  FETCH_PRIORITY_HIGH: "high";
  FETCH_PRIORITY_LOW: "low";
  IS_VIDEO: "is-video";
  CAN_EXPAND: "can-expand";
  AUTO_PLAY: "auto-play";
  CAPTIONS: "captions";
  CONTROLS: "controls";
  AUTOPLAY: "autoplay";
  MUTED: "muted";
  PLAYSINLINE: "playsinline";
  WEBKIT_PLAYSINLINE: "webkit-playsinline";
  LOOP: "loop";
  CONTROLS_LIST: "controlslist";
  NO_DOWNLOAD: "nodownload";
  DISABLE_PICTURE_IN_PICTURE: "disablePictureInPicture";
  DRAGGABLE: "draggable";
  VIDEO_MP4: "video/mp4";
  AUDIO_OGG: "audio/ogg";
  AUDIO_MPEG: "audio/mpeg";
}>;
```

Defined in: [core/tokens/attrs/media.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/attrs/media.ts#L12)

Media element attribute + MIME-type tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
