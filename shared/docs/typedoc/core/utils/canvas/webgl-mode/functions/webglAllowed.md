[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/canvas/webgl-mode](../README.md) / webglAllowed

```ts
function webglAllowed(): boolean;
```

Defined in: [core/utils/canvas/webgl-mode.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/webgl-mode.ts#L58)

Whether WebGL is currently preferred. Explicit debug fallback and the
user's reduced-motion mode both select the CSS/Canvas2D path; disabling
reduced motion makes the next interaction-driven retry eligible again.

## Returns

`boolean`
