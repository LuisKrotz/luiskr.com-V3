[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [shared/src/app/view](../README.md) / flipAppView

```ts
function flipAppView(
   c, 
   outlet, 
   _to?
): Promise<void>;
```

Defined in: [shared/src/app/view.ts:63](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/shared/src/app/view.ts#L63)

View swap: lazy-imports the target view's chunk (each import is in its
own branch so bundlers keep per-route code-splitting), then either
instant-replaces the outlet (reduced motion / empty outlet) or plays
the two-leg cross-fade — fade-out for PAGE_FADE_HALF, then mount the
incoming view with a fade-in class removed on the next frame.
`_sectionsMeasured` resets so the new view's sections re-measure lazily.

## Parameters

### c

[`AppRoot`](../../../App/classes/AppRoot.md)

The AppRoot element.

### outlet

`Element`

The #view-outlet element.

### \_to?

[`RouteDescriptor`](../../../../../core/router/types/interfaces/RouteDescriptor.md)

Destination descriptor — the tag is read from c.currentViewTag.

## Returns

`Promise`\<`void`\>
