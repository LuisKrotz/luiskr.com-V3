[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/widgets/close-button/shaders](../README.md) / CLOSE\_BUTTON\_VS

```ts
const CLOSE_BUTTON_VS: "\n        attribute vec2 a_pos;\n        varying vec2 v_uv;\n        void main() {\n          v_uv = (a_pos + 1.0) * 0.5;\n          gl_Position = vec4(a_pos, 0.0, 1.0);\n        }\n      ";
```

Defined in: [core/utils/canvas/widgets/close-button/shaders.ts:10](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/close-button/shaders.ts#L10)

Fullscreen quad vertex shader — passes a_pos through as v_uv 0..1.
