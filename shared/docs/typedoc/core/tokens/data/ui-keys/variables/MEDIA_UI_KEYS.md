[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/ui-keys](../README.md) / MEDIA\_UI\_KEYS

```ts
const MEDIA_UI_KEYS: Readonly<{
  MEDIA_PREVIEW: "media.preview";
  MEDIA_VIDEO_CONTROLS: "media.videoControls";
  MEDIA_AUTOPLAY: "media.autoplay";
  MEDIA_GO_TO_SLIDE: "media.goToSlide";
  MEDIA_TO_EXPAND: "media.toExpand";
}>;
```

Defined in: [core/tokens/data/ui-keys.ts:126](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/ui-keys.ts#L126)

Frozen media ui key map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
