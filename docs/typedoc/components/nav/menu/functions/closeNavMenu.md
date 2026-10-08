[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / closeNavMenu

```ts
function closeNavMenu(host): void
```

Defined in: [website/components/nav/menu.tsx:206](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/nav/menu.tsx#L206)

Closes the menu through the full dissolve cycle: adds the -closing
class (CSS plays the item fade-out), releases the contour field so it
dissolves back to center, then after MENU_CLOSE_DURATION destroys
all three GL widgets + their canvases and re-renders the closed nav.
The _menuClosing guard makes double-close (Esc + click) a no-op.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
