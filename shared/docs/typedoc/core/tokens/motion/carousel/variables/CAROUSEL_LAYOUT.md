[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/carousel](../README.md) / CAROUSEL\_LAYOUT

```ts
const CAROUSEL_LAYOUT: Readonly<{
  CIRCUMFERENCE: number;
  MOBILE_BREAKPOINT: 768;
  SIDE_BY_SIDE_BREAKPOINT: 960;
  SWIPE_THRESHOLD: 40;
  MAX_HEIGHT_VH: 70;
  SKELETON_ITEM_HEIGHT: "70vh";
  CENTER_EPS_PX: 10;
  VISIBILITY_RATIO: 0.15;
  FIT_EPS_PX: 4;
  ITEM_GAP_PX: 32;
  MEDIA_MIN_WIDTH: 320;
  MEDIA_MIN_WIDTH_VW: 375;
  ITEM_MARGIN_PX: 24;
  ITEM_MARGIN_VW: 1024;
  STRIP_H_1024: 377;
  STRIP_H_1440: 610;
  STRIP_H_2560: 987;
  STRIP_SUB_MOBILE: 42;
  STRIP_SUB_TABLET: 68;
  ITEM_PAD_DEFAULT: 26;
  ITEM_PAD_768: 42;
  ITEM_PAD_1440: 68;
  ITEM_PAD_1920: 110;
  REG_CAP_SUB: 158;
  LAND_CAP_SUB_1024: 55;
  LAND_CAP_SUB_1280: 89;
  LAND_CAP_SUB_1440: 377;
  LAND_CAP_SUB_1920: 233;
  MAX_HEIGHT_FALLBACK: 600;
}>;
```

Defined in: [core/tokens/motion/carousel.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/carousel.ts#L30)

Frozen carousel map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
