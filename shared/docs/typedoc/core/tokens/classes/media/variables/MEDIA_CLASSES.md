[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/media](../README.md) / MEDIA\_CLASSES

```ts
const MEDIA_CLASSES: Readonly<{
  RENDER_MEDIA: "render-media";
  RENDER_MEDIA_HIGH: "render-media--high";
  RENDER_MEDIA_EXPAND: "render-media--can-expand";
  RENDER_MEDIA_THUMB: "render-media--thumb";
  RENDER_MEDIA_LOADED: "render-media--loaded";
  RENDER_PLACEHOLDER: "render-placeholder";
  RENDER_PLACEHOLDER_FIGURE: "render-placeholder-figure";
  MEDIA_FIGURE: "media-figure";
  MEDIA_FIGURE_LOADED: "media-figure--loaded";
}>;
```

Defined in: [core/tokens/classes/media.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/media.ts#L14)

Frozen media class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
