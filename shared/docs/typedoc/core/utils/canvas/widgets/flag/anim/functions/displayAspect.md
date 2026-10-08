[**luiskr.com**](../../../../../../../README.md)

***

[luiskr.com](../../../../../../../README.md) / [core/utils/canvas/widgets/flag/anim](../README.md) / displayAspect

```ts
function displayAspect(flag): number;
```

Defined in: [core/utils/canvas/widgets/flag/anim.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/canvas/widgets/flag/anim.ts#L19)

Display aspect of the whole canvas. A split flag shows the left half of
the first flag and the right half of the second, each at natural scale,
so its width is the mean of both natural widths.

## Parameters

### flag

[`FlagWebGL`](../../../flag-webgl/classes/FlagWebGL.md)

## Returns

`number`

natural aspect ratio the flag should display at.
