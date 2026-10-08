[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/dimensions](../README.md) / FLAG\_DIMENSIONS

```ts
const FLAG_DIMENSIONS: Readonly<{
  FLAG_NAV_WIDTH: 18;
  FLAG_NAV_HEIGHT: 13;
  FLAG_SMALL_THRESHOLD: 25;
  FLAG_DEFAULT_ASPECT: 1.5;
  FLAG_NAV_SPLIT_WIDTH: 8;
  FLAG_DIALOG_WIDTH: 60;
  FLAG_DIALOG_HEIGHT: 44;
  FLAG_DIALOG_SPLIT_WIDTH: 33;
}>;
```

Defined in: [core/tokens/media/dimensions.ts:59](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/dimensions.ts#L59)

Frozen flag-icon geometry map — flag images are drawn at small pixel
sizes where every px counts: NAV (18×13) for the locale picker, DIALOG
(60×44) for the language dialog, SPLIT widths for the half-flag
divider, and `FLAG_DEFAULT_ASPECT` 1.5 (3:2, the most common national
flag ratio) as the fallback when a flag lacks intrinsic dims.
