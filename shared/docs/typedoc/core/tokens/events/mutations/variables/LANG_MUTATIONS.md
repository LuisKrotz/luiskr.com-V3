[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/events/mutations](../README.md) / LANG\_MUTATIONS

```ts
const LANG_MUTATIONS: Readonly<{
  SET_APP_LANG: "setAppLang";
  SET_LANG: "setLang";
  SET_COMPONENT_LANG: "setComponentLang";
  SET_SLUGS_LANG: "setSlugsLang";
  SET_CAROUSEL_LANG: "setCarouselLang";
  SET_STATS_HUD_LANG: "setStatsHudLang";
}>;
```

Defined in: [core/tokens/events/mutations.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/events/mutations.ts#L24)

Frozen lang store-mutation name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
