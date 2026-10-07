[**luiskr.com**](../../../../../../README.md)

---

[luiskr.com](../../../../../../README.md) / [utils/canvas/loaders/menu-background/loop](../README.md) / start

```ts
function start(host): void
```

Defined in: [src/utils/canvas/loaders/menu-background/loop.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/canvas/loaders/menu-background/loop.ts#L31)

Begins the render loop on menu open: resamples theme inks, sizes the
buffer, attaches the ResizeObserver, and either starts RAF or — under
reduced motion — draws one fully-revealed static frame.

## Parameters

### host

[`MenuBackgroundWebGL`](../../../menu-background-webgl/classes/MenuBackgroundWebGL.md)

## Returns

`void`
