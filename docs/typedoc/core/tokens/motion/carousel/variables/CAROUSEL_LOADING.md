[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/motion/carousel](../README.md) / CAROUSEL\_LOADING

```ts
const CAROUSEL_LOADING: Readonly<{
  EAGER_COUNT: 2
  BATCH_SIZE: 2
  DEFERRED_TIMEOUT: 250
}>
```

Defined in: [core/tokens/motion/carousel.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/motion/carousel.ts#L60)

Frozen carousel map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
