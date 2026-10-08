[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/events/mutations](../README.md) / PREF\_MUTATIONS

```ts
const PREF_MUTATIONS: Readonly<{
  TOGGLE_STATS_FOR_NERDS: "toggleStatsForNerds";
  TOGGLE_SHOW_GRID: "toggleShowGrid";
  TOGGLE_REDUCED_MOTION: "toggleReducedMotion";
  SET_REDUCED_MOTION: "setReducedMotion";
  SET_THEME: "setTheme";
  INIT_THEME: "initTheme";
  INIT_REDUCED_MOTION: "initReducedMotion";
  APPLY_THEME: "applyTheme";
  TOGGLE_VIDEO_AUTOPLAY: "toggleVideoAutoplay";
  SET_VIDEO_AUTOPLAY: "setVideoAutoplay";
}>;
```

Defined in: [core/tokens/events/mutations.ts:38](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/events/mutations.ts#L38)

Frozen pref store-mutation name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
