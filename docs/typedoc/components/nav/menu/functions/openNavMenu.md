[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / openNavMenu

```ts
function openNavMenu(host): void
```

Defined in: [src/components/nav/menu.tsx:107](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L107)

Opens the menu: flips the state flags and re-renders — the new DOM
mounts the menu canvases, then onUpdated → mountNavMenuWebGL attaches
the widgets. Scroll-lock is handled by the CSS class on the wrapper.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
