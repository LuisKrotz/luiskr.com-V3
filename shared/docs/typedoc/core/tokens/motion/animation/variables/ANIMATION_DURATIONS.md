[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/animation](../README.md) / ANIMATION\_DURATIONS

```ts
const ANIMATION_DURATIONS: Readonly<{
  ROUTE_DURATION: 450;
  PAGE_FADE_HALF: 350;
  PROGRESS_BAR_RESET: 1100;
  MOSAIC_DURATION: 420;
  CAROUSEL_FADE_DURATION: 800;
  MENU_CLOSE_DURATION: 1200;
  MENU_SETTLE_DURATION: 2200;
  DIALOG_LEAVE_DURATION: 640;
  LOADER_FADE_MS: 800;
  SCROLL_DURATION: 600;
  SCROLL_MIN_DISTANCE: 2;
}>;
```

Defined in: [core/tokens/motion/animation.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/animation.ts#L24)

Frozen animation map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
