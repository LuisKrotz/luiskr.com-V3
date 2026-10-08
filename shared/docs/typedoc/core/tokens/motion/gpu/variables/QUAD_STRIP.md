[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/gpu](../README.md) / QUAD\_STRIP

```ts
const QUAD_STRIP: Readonly<{
  VERTS: number[];
  VERTEX_COUNT: 4;
}>;
```

Defined in: [core/tokens/motion/gpu.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/gpu.ts#L40)

Fullscreen-quad clip-space vertices for TRIANGLE_STRIP draw — 4 verts
covering [-1,-1]→[1,1]. Shared by every shader quad so the literal is
declared once (zero-hardcoding rule); VERTEX_COUNT is the drawArrays n.
