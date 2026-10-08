[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/storage](../README.md) / PREF\_STORAGE\_KEYS

```ts
const PREF_STORAGE_KEYS: Readonly<{
  VIDEO_AUTOPLAY: "videoAutoplay";
  LOCALE: "locale";
  REDUCED_MOTION: "reducedMotion";
  THEME: "theme";
  STATS_FOR_NERDS: "statsForNerds";
  SHOW_GRID: "showGrid";
  COOKIE: "cookie";
  SPACE_PLAYGROUND: "spacePlayground";
}>;
```

Defined in: [core/tokens/data/storage.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/storage.ts#L12)

localStorage/sessionStorage key tokens split by scope. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
