[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/motion/gpu](../README.md) / WEBGL\_POOL\_OBSERVER

```ts
const WEBGL_POOL_OBSERVER: Readonly<{
  THRESHOLD: 0.01
}>
```

Defined in: [src/core/tokens/motion/gpu.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/motion/gpu.ts#L50)

WebGL-pool visibility observer tuning — a 1% intersection suffices to
count a canvas as visible (any pixel restores it; the rootMargin
pre-warms slightly before it scrolls in).
