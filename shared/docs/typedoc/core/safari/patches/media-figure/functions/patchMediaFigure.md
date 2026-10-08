[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/safari/patches/media-figure](../README.md) / patchMediaFigure

```ts
function patchMediaFigure(): void;
```

Defined in: [core/safari/patches/media-figure.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/safari/patches/media-figure.ts#L35)

Installs the MediaFigure patch once the element registers:
 - `_renderInitial` is wrapped to inject the safari-media stylesheet
   into the shadow root after the base render.
 - `loadHighRes` is replaced by safariLoadHighRes (Q50-capped source so
   the decode stays under WebKit's ~4096px image ceiling).
 - `onMounted` is wrapped to clear the compositor hints Safari
   mishandles (will-change/transform/backface-visibility), patch video
   figures (muted autoplay + first-touch unlock retry), bind the
   tap-vs-scroll expand gesture on expandable figures, and bind the
   image load/error → isLoaded path for the shimmer handoff.

## Returns

`void`
