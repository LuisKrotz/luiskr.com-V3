[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/widgets/flag/shaders](../README.md) / FLAG\_VS

```ts
const FLAG_VS: "\n        attribute vec2 a_pos;\n        varying vec2 v_uv;\n        void main() {\n          v_uv = (a_pos + 1.0) * 0.5;\n          // Invert y so top-left matches standard image coords\n          v_uv.y = 1.0 - v_uv.y;\n          gl_Position = vec4(a_pos, 0.0, 1.0);\n        }\n      ";
```

Defined in: [core/utils/canvas/widgets/flag/shaders.ts:9](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/shaders.ts#L9)

Fullscreen-quad vertex shader: a_pos in clip space, v_uv 0–1.
