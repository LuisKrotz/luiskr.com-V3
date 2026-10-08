[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-layout](../README.md) / calcDrawTextOffset

```ts
function calcDrawTextOffset(
   idx, 
   charsBefore, 
   delay
): number;
```

Defined in: [core/utils/wasm/wasm-layout.ts:176](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-layout.ts#L176)

Start-time offset for character `idx`: charsBefore·delay staggers it
after the preceding run, plus idx·DRAW_INDEX_STEP_MS so later items in
a list cascade even at equal char counts.

## Parameters

### idx

`number`

Index of this item/word in the sequence.

### charsBefore

`number`

Cumulative characters before this item.

### delay

`number`

Per-char delay from calcDrawTextDelay.

## Returns

`number`

Start offset in ms.
