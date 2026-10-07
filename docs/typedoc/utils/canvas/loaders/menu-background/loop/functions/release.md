[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/menu-background/loop](../README.md) / release

```ts
function release(host): void
```

Defined in: [src/utils/canvas/loaders/menu-background/loop.ts:70](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/loaders/menu-background/loop.ts#L70)

Eases the reveal back to 0 — used when the menu closes so the field
dissolves instead of cutting out. Rendering continues until stop()
lets the dissolve finish before the GPU goes idle.

## Parameters

### host

[`MenuBackgroundWebGL`](../../../menu-background-webgl/classes/MenuBackgroundWebGL.md)

## Returns

`void`
