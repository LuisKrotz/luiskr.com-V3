[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/params](../README.md) / SP\_CAMERA\_PARAMS

```ts
const SP_CAMERA_PARAMS: Readonly<{
  FOV: "fov";
  ROTATE_SPEED: "rotate-speed";
  AUTO_ROTATE: "auto-rotate";
}>;
```

Defined in: [core/tokens/playground/params.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/params.ts#L14)

`data-param` values on playground sliders/checkboxes split by subsystem. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
