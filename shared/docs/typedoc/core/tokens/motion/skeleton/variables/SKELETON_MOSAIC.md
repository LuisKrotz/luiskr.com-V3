[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/skeleton](../README.md) / SKELETON\_MOSAIC

```ts
const SKELETON_MOSAIC: Readonly<{
  MOSAIC_TILES: 12;
  MOSAIC_FEATURED: 6;
  MOSAIC_LCP_TILES: 2;
}>;
```

Defined in: [core/tokens/motion/skeleton.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/skeleton.ts#L66)

Frozen skeleton map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
