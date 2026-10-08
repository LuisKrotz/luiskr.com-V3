[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/skeleton](../README.md) / SKELETON\_GLYPH

```ts
const SKELETON_GLYPH: Readonly<{
  CELL_MIN: 7;
  CELL_MAX: 13;
  CELL_MEDIA: 16;
  TEXT_MAX_HEIGHT: 80;
  EDGE_SOFTNESS: 0.32;
  TEXT_DENSITY_BASE: 0.28;
  TEXT_DENSITY_DRIFT: 0.04;
  TEXT_ALPHA: 0.42;
  INK_SURFACE_MIX_NEAR: 0.68;
  INK_SURFACE_MIX_FAR: 0.86;
}>;
```

Defined in: [core/tokens/motion/skeleton.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/skeleton.ts#L32)

Frozen skeleton map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
