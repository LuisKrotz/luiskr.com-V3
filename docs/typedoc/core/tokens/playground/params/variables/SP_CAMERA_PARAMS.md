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

Defined in: [src/core/tokens/playground/params.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/playground/params.ts#L14)

`data-param` values on playground sliders/checkboxes split by subsystem. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
