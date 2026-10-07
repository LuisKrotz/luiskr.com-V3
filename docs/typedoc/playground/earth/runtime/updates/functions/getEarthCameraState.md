[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/updates](../README.md) / getEarthCameraState

```ts
function getEarthCameraState(s): {
  position: {
    x: number
    y: number
    z: number
  }
  target: {
    x: number
    y: number
    z: number
  }
} | null
```

Defined in: [src/playground/earth/runtime/updates.ts:237](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/playground/earth/runtime/updates.ts#L237)

Current camera position + orbit target, rounded to 2 decimals — used
to persist/restore the view in the playground's settings snapshot.

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

## Returns

\| \{
`position`: \{
`x`: `number`;
`y`: `number`;
`z`: `number`;
\};
`target`: \{
`x`: `number`;
`y`: `number`;
`z`: `number`;
\};
\}
\| `null`
