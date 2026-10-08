[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/components/nav/menu](../README.md) / navBurgerCanvas

```ts
function navBurgerCanvas(host, label): HTMLCanvasElement;
```

Defined in: [website/components/nav/menu.tsx:64](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L64)

The burger icon's canvas element — lazily created once and kept for
the component's lifetime so its WebGL context is never churned by
re-renders (canvas recreation would force a fresh GL context). Each
call also re-syncs the on-dark class and aria-label/expanded since
those change without recreating the element.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

AppNav instance.

### label

`string`

aria-label for the burger (localized "menu").

## Returns

`HTMLCanvasElement`

The persistent canvas element.
