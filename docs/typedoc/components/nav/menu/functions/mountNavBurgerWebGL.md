[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / mountNavBurgerWebGL

```ts
function mountNavBurgerWebGL(host): void
```

Defined in: [website/components/nav/menu.tsx:179](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/website/components/nav/menu.tsx#L179)

Attaches BurgerButtonWebGL to the persistent burger canvas — or tears
it down when the canvas left the DOM (menu states that remove the
burger, e.g. 404). Idempotent: a live widget is never re-created.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
