[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/runtime/frame](../README.md) / tickEarth

```ts
function tickEarth(s): void;
```

Defined in: [experiments/earth-playground/earth/runtime/frame.ts:71](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/frame.ts#L71)

Per-frame update, self-rescheduling via RAF.
  sun  — angle += 0.01·speed rad/frame, wrapped at 2π, then syncEarthSun
  moon — inclined-circle orbit: x = cos·d, y = sin(incl)·d,
         z = sin·cos(incl)·d (the z term flattens the circle into the
         inclination ellipse); lookAt(0,0,0) keeps the near face lit-side
  earth — y-spin at rotationSpeed rad/frame; clouds counter-rotate at
         0.2× for differential atmosphere drift
  render — pipeline if built (post FX), else plain scene render;
         a pipeline throw falls back within the same frame

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

## Returns

`void`
