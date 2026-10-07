[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [app/types](../README.md) / RoutableView

```ts
type RoutableView = Element & object
```

Defined in: [src/app/types.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/app/types.ts#L40)

A mounted view element that may implement onRouteParamChange — the
outlet calls it when a same-tag route updates params (project→project
navigation reuses the element).

## Type Declaration

### onRouteParamChange?

```ts
optional onRouteParamChange?: (_route) => void;
```

#### Parameters

##### \_route

\| [`RouteDescriptor`](../../../routes/types/interfaces/RouteDescriptor.md)
\| `null`

#### Returns

`void`
