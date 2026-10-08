[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/runtime/frame](../README.md) / syncEarthSun

```ts
function syncEarthSun(s): void;
```

Defined in: [experiments/earth-playground/earth/runtime/frame.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/frame.ts#L17)

Repositions the sun light + sprite from sun {angle, inclination} on
the fixed 200u orbit, then renormalizes the sunDir uniform — every
shader term (day/night, eclipse, scattering) reads this one uniform.

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

## Returns

`void`
