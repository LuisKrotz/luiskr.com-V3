[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/components/nav/menu](../README.md) / mountNavBurgerWebGL

```ts
function mountNavBurgerWebGL(host): void;
```

Defined in: [website/components/nav/menu.tsx:179](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/menu.tsx#L179)

Attaches BurgerButtonWebGL to the persistent burger canvas — or tears
it down when the canvas left the DOM (menu states that remove the
burger, e.g. 404). Idempotent: a live widget is never re-created.

## Parameters

### host

[`NavMenuHost`](../interfaces/NavMenuHost.md)

## Returns

`void`
