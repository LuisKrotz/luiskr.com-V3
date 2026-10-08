[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/gpu](../README.md) / WEBGL\_POOL\_OBSERVER

```ts
const WEBGL_POOL_OBSERVER: Readonly<{
  THRESHOLD: 0.01;
}>;
```

Defined in: [core/tokens/motion/gpu.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/gpu.ts#L50)

WebGL-pool visibility observer tuning — a 1% intersection suffices to
count a canvas as visible (any pixel restores it; the rootMargin
pre-warms slightly before it scrolls in).
