[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/motion/gpu](../README.md) / QUAD\_STRIP

```ts
const QUAD_STRIP: Readonly<{
  VERTS: number[]
  VERTEX_COUNT: 4
}>
```

Defined in: [src/core/tokens/motion/gpu.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/motion/gpu.ts#L40)

Fullscreen-quad clip-space vertices for TRIANGLE_STRIP draw — 4 verts
covering [-1,-1]→[1,1]. Shared by every shader quad so the literal is
declared once (zero-hardcoding rule); VERTEX_COUNT is the drawArrays n.
