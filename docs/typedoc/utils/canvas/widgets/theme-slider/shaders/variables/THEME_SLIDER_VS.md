[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/widgets/theme-slider/shaders](../README.md) / THEME\_SLIDER\_VS

```ts
const THEME_SLIDER_VS: '        attribute vec2 a_pos;\n        varying vec2 v_uv;\n        void main() {\n          v_uv = (a_pos + 1.0) * 0.5;\n          gl_Position = vec4(a_pos, 0.0, 1.0);\n        }\n      '
```

Defined in: [src/utils/canvas/widgets/theme-slider/shaders.ts:8](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/widgets/theme-slider/shaders.ts#L8)

Fullscreen-quad vertex shader: a_pos in clip space, v_uv 0–1.
