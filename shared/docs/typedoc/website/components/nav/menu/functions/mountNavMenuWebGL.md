[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/components/nav/menu](../README.md) / mountNavMenuWebGL

```ts
function mountNavMenuWebGL(host): void;
```

Defined in: [website/components/nav/menu.tsx:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L142)

Binds the WebGL layers to the persistent menu canvases. Because the
canvas elements survive re-renders, each context is created once per
open cycle instead of once per store/router update.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
