[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [routes/types](../README.md) / NavHook

```ts
type NavHook = (_to, from) => unknown
```

Defined in: [src/routes/types.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/routes/types.ts#L40)

Guard/hook signature — a returned string/{path} short-circuits into a redirect.

## Parameters

### \_to

[`RouteDescriptor`](../interfaces/RouteDescriptor.md)

### from

[`RouteDescriptor`](../interfaces/RouteDescriptor.md) \| `null`

## Returns

`unknown`
