[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / mountNavMenuWebGL

```ts
function mountNavMenuWebGL(host): void
```

Defined in: [src/components/nav/menu.tsx:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/nav/menu.tsx#L142)

Binds the WebGL layers to the persistent menu canvases. Because the
canvas elements survive re-renders, each context is created once per
open cycle instead of once per store/router update.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
