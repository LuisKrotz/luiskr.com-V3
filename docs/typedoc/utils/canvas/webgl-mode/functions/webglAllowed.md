[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/canvas/webgl-mode](../README.md) / webglAllowed

```ts
function webglAllowed(): boolean
```

Defined in: [src/utils/canvas/webgl-mode.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/webgl-mode.ts#L58)

Whether WebGL is currently preferred. Explicit debug fallback and the
user's reduced-motion mode both select the CSS/Canvas2D path; disabling
reduced motion makes the next interaction-driven retry eligible again.

## Returns

`boolean`
