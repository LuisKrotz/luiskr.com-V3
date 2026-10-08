[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [website/components/nav/flag](../README.md) / navFlagCanvas

```ts
function navFlagCanvas(host): HTMLCanvasElement;
```

Defined in: [website/components/nav/flag.tsx:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/nav/flag.tsx#L43)

Returns the persistent flag canvas for the current locale, rebuilding
it only when the locale changed — a new canvas means a new GL context,
so the old widget is destroyed first to keep total contexts bounded.

## Parameters

### host

[`NavFlagHost`](../interfaces/NavFlagHost.md)

AppNav instance.

## Returns

`HTMLCanvasElement`

The per-locale canvas element.
