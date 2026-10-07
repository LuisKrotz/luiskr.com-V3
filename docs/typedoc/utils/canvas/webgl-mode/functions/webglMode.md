[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/canvas/webgl-mode](../README.md) / webglMode

```ts
function webglMode(): WebGLMode
```

Defined in: [src/utils/canvas/webgl-mode.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/webgl-mode.ts#L32)

Reads `?debug=webGLMode:<mode>` from the current location. Multiple
`debug` params are allowed; the LAST `webGLMode:` value wins so a
pasted URL can override an earlier flag.

## Returns

[`WebGLMode`](../type-aliases/WebGLMode.md)
