[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / navBurgerCanvas

```ts
function navBurgerCanvas(host, label): HTMLCanvasElement
```

Defined in: [src/components/nav/menu.tsx:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L46)

The burger icon's canvas element — lazily created once and kept for
the component's lifetime so its WebGL context is never churned by
re-renders (canvas recreation would force a fresh GL context).

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

### label

`string`

## Returns

`HTMLCanvasElement`
