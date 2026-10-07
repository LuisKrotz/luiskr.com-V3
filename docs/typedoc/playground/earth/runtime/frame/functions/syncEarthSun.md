[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/runtime/frame](../README.md) / syncEarthSun

```ts
function syncEarthSun(s): void
```

Defined in: [src/playground/earth/runtime/frame.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/runtime/frame.ts#L17)

Repositions the sun light + sprite from sun {angle, inclination} on
the fixed 200u orbit, then renormalizes the sunDir uniform — every
shader term (day/night, eclipse, scattering) reads this one uniform.

## Parameters

### s

[`EarthState`](../../state/interfaces/EarthState.md)

## Returns

`void`
