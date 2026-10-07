[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/motion/skeleton](../README.md) / SKELETON\_WARN

```ts
const SKELETON_WARN: Readonly<{
  ARIA_HIDDEN: 'aria-hidden'
  SHADER_WARN: 'SkeletonWebGL shader error:'
  SOFTWARE_RENDERERS: RegExp
}>
```

Defined in: [src/core/tokens/motion/skeleton.ts:80](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/motion/skeleton.ts#L80)

Frozen skeleton map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
