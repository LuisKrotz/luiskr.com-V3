[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/setup/scene-setup](../README.md) / setupEarthGroup

```ts
function setupEarthGroup(s, deps): Promise<boolean>
```

Defined in: [src/playground/earth/setup/scene-setup.ts:164](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/setup/scene-setup.ts#L164)

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
