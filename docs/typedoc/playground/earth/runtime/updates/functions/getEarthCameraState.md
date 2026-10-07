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

Defined in: [src/playground/earth/runtime/updates.ts:237](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/updates.ts#L237)

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
