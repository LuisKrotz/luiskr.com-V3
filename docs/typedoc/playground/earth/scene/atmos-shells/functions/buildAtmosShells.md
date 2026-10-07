[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [playground/earth/scene/atmos-shells](../README.md) / buildAtmosShells

```ts
function buildAtmosShells(__namedParameters): AtmosShellsResult
```

Defined in: [src/playground/earth/scene/atmos-shells.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/playground/earth/scene/atmos-shells.ts#L42)

Builds both atmosphere shells sharing one scattering model:
atmosMesh — BackSide additive shell (10.2u): the camera looks
_through_ the shell, so each fragment is the air between
the viewer and the far wall
innerMesh — FrontSide fresnel rim (+0.02u): (1 − view·n)⁶ is
near-zero everywhere except the extreme grazing rim,
producing the thin bright line at the limb

## Parameters

### \_\_namedParameters

[`AtmosShellsArgs`](../interfaces/AtmosShellsArgs.md)

## Returns

[`AtmosShellsResult`](../interfaces/AtmosShellsResult.md)
