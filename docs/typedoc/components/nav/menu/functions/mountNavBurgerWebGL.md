[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [components/nav/menu](../README.md) / mountNavBurgerWebGL

```ts
function mountNavBurgerWebGL(host): void
```

Defined in: [src/components/nav/menu.tsx:161](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/components/nav/menu.tsx#L161)

Attaches BurgerButtonWebGL to the persistent burger canvas — or tears
it down when the canvas left the DOM (menu states that remove the
burger, e.g. 404). Idempotent: a live widget is never re-created.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
