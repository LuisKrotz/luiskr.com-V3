[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/canvas/webgl-mode](../README.md) / webglMode

```ts
function webglMode(): WebGLMode
```

Defined in: [src/utils/canvas/webgl-mode.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/canvas/webgl-mode.ts#L32)

Reads `?debug=webGLMode:<mode>` from the current location. Multiple
`debug` params are allowed; the LAST `webGLMode:` value wins so a
pasted URL can override an earlier flag.

## Returns

[`WebGLMode`](../type-aliases/WebGLMode.md)
