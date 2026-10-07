[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / closeNavMenu

```ts
function closeNavMenu(host): void
```

Defined in: [src/components/nav/menu.tsx:188](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L188)

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
