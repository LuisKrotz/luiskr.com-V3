[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/setup/scene-setup](../README.md) / setupSun

```ts
function setupSun(
   s, 
   THREE, 
   TSL
): void;
```

Defined in: [experiments/earth-playground/earth/setup/scene-setup.ts:76](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/setup/scene-setup.ts#L76)

Directional sun at 200u (far enough that its direction is effectively
parallel across the 20u Earth) + the visible 6u sprite co-located with
the light — color ×2 pushes it over the bloom threshold so it halos.

## Parameters

### s

[`EarthState`](../../../runtime/state/interfaces/EarthState.md)

### THREE

`__module`

### TSL

`__module`

## Returns

`void`
