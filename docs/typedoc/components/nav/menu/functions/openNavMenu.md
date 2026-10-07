[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / openNavMenu

```ts
function openNavMenu(host): void
```

Defined in: [src/components/nav/menu.tsx:125](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/nav/menu.tsx#L125)

Opens the menu: flips the state flags and re-renders — the new DOM
mounts the menu canvases, then onUpdated → mountNavMenuWebGL attaches
the widgets. Scroll-lock is handled by the CSS class on the wrapper.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
