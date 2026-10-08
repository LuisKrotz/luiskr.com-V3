[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/setup/scene-setup](../README.md) / setupEarthGroup

```ts
function setupEarthGroup(s, deps): Promise<boolean>;
```

Defined in: [experiments/earth-playground/earth/setup/scene-setup.ts:164](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/setup/scene-setup.ts#L164)

The 4-shell Earth group (see earth/meshes.ts). Anisotropy is maxed at
the renderer's supported level (clamped fallback 4) — equirect maps
sampled at grazing angles near the limb blur badly without it.

## Parameters

### s

[`EarthState`](../../../runtime/state/interfaces/EarthState.md)

### deps

`SceneDeps`

## Returns

`Promise`\<`boolean`\>
