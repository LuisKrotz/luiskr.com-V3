[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [shared/src/app/types](../README.md) / RoutableView

```ts
type RoutableView = Element & object;
```

Defined in: [shared/src/app/types.ts:40](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/shared/src/app/types.ts#L40)

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

  \| [`RouteDescriptor`](../../../../../core/router/types/interfaces/RouteDescriptor.md)
  \| `null`

#### Returns

`void`
