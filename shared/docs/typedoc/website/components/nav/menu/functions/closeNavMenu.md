[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/components/nav/menu](../README.md) / closeNavMenu

```ts
function closeNavMenu(host): void;
```

Defined in: [website/components/nav/menu.tsx:206](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L206)

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
