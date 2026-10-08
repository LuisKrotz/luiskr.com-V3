[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/router/types](../README.md) / NavHook

```ts
type NavHook = (_to, from) => unknown;
```

Defined in: [core/router/types.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/router/types.ts#L42)

Guard/hook signature — a returned string/{path} short-circuits into a redirect.

## Parameters

### \_to

[`RouteDescriptor`](../interfaces/RouteDescriptor.md)

### from

[`RouteDescriptor`](../interfaces/RouteDescriptor.md) \| `null`

## Returns

`unknown`
