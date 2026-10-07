[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/playground/params](../README.md) / SP\_CAMERA\_PARAMS

```ts
const SP_CAMERA_PARAMS: Readonly<{
  FOV: 'fov'
  ROTATE_SPEED: 'rotate-speed'
  AUTO_ROTATE: 'auto-rotate'
}>
```

Defined in: [src/core/tokens/playground/params.ts:9](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/tokens/playground/params.ts#L9)

## File

tokens/playground/params.js

## Description

`data-param` values on playground sliders/checkboxes split by
subsystem — grouped subsets of SP_PARAMS. The stable wire between a DOM
input and an engine setter (`PARAM_HANDLERS` in SpacePlayground maps each
token to an `earthBg.update*()` call).
