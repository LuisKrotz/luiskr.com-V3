[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/motion/carousel](../README.md) / CAROUSEL\_LAYOUT

```ts
const CAROUSEL_LAYOUT: Readonly<{
  CIRCUMFERENCE: number
  MOBILE_BREAKPOINT: 768
  SIDE_BY_SIDE_BREAKPOINT: 960
  SWIPE_THRESHOLD: 40
  MAX_HEIGHT_VH: 70
  SKELETON_ITEM_HEIGHT: '70vh'
  CENTER_EPS_PX: 10
  VISIBILITY_RATIO: 0.15
  FIT_EPS_PX: 4
  ITEM_GAP_PX: 32
  MAX_HEIGHT_FALLBACK: 600
}>
```

Defined in: [src/core/tokens/motion/carousel.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/motion/carousel.ts#L30)

Frozen carousel map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
