[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [experiments/earth-playground/earth/runtime/state](../README.md) / EarthProgressFn

```ts
type EarthProgressFn = (_label, percent) => void;
```

Defined in: [experiments/earth-playground/earth/runtime/state.ts:21](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/earth-playground/earth/runtime/state.ts#L21)

Progress callback signature — label + percent so the loader UI can show
which asset is streaming and how far along the whole boot is.

## Parameters

### \_label

`string`

Asset label for the loader text.

### percent

`number`

0–100 progress through the boot sequence.

## Returns

`void`
