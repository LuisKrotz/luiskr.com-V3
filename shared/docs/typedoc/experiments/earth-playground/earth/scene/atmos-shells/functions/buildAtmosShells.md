[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/scene/atmos-shells](../README.md) / buildAtmosShells

```ts
function buildAtmosShells(__namedParameters): AtmosShellsResult;
```

Defined in: [experiments/earth-playground/earth/scene/atmos-shells.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/scene/atmos-shells.ts#L44)

Builds both atmosphere shells sharing one scattering model:
  atmosMesh — BackSide additive shell (10.2u): the camera looks
              *through* the shell, so each fragment is the air between
              the viewer and the far wall
  innerMesh — FrontSide fresnel rim (+0.02u): (1 − view·n)⁶ is
              near-zero everywhere except the extreme grazing rim,
              producing the thin bright line at the limb

## Parameters

### \_\_namedParameters

[`AtmosShellsArgs`](../interfaces/AtmosShellsArgs.md)

## Returns

[`AtmosShellsResult`](../interfaces/AtmosShellsResult.md)
