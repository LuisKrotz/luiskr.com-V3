[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/canvas/webgl-mode](../README.md) / webglMode

```ts
function webglMode(): WebGLMode;
```

Defined in: [core/utils/canvas/webgl-mode.ts:32](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/webgl-mode.ts#L32)

Reads `?debug=webGLMode:<mode>` from the current location. Multiple
`debug` params are allowed; the LAST `webGLMode:` value wins so a
pasted URL can override an earlier flag.

## Returns

[`WebGLMode`](../type-aliases/WebGLMode.md)
