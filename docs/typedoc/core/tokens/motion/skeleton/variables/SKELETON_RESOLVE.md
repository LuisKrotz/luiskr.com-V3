[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/motion/skeleton](../README.md) / SKELETON\_RESOLVE

```ts
const SKELETON_RESOLVE: Readonly<{
  RESOLVE_DURATION: 480
}>
```

Defined in: [core/tokens/motion/skeleton.ts:56](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/motion/skeleton.ts#L56)

Frozen skeleton map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
