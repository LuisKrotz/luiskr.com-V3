[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/components/nav/menu](../README.md) / openNavMenu

```ts
function openNavMenu(host): void;
```

Defined in: [website/components/nav/menu.tsx:125](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L125)

Opens the menu: flips the state flags and re-renders — the new DOM
mounts the menu canvases, then onUpdated → mountNavMenuWebGL attaches
the widgets. Scroll-lock is handled by the CSS class on the wrapper.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
