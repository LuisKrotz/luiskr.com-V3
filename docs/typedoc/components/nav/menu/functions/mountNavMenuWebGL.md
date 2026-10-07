[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / mountNavMenuWebGL

```ts
function mountNavMenuWebGL(host): void
```

Defined in: [src/components/nav/menu.tsx:124](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L124)

Binds the WebGL layers to the persistent menu canvases. Because the
canvas elements survive re-renders, each context is created once per
open cycle instead of once per store/router update.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
