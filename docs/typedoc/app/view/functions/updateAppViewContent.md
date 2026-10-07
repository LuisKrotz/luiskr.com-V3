[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [app/view](../README.md) / updateAppViewContent

```ts
function updateAppViewContent(c, to?, _from?): void
```

Defined in: [src/app/view.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/app/view.ts#L27)

Route-change reconciliation for the view outlet: when the target view
tag equals the mounted one (and the element is actually defined), the
view is kept alive and told about the new route via onRouteParamChange —
project→project navigation must not tear down GL state. A tag change
delegates to _flipToView for the swap.

## Parameters

### c

[`AppRoot`](../../../App/classes/AppRoot.md)

The AppRoot element.

### to?

[`RouteDescriptor`](../../../routes/types/interfaces/RouteDescriptor.md)

Destination descriptor (falls back to router.currentRoute).

### \_from?

\| [`RouteDescriptor`](../../../routes/types/interfaces/RouteDescriptor.md)
\| `null`

Origin descriptor — unused, kept for listener parity.

## Returns

`void`
