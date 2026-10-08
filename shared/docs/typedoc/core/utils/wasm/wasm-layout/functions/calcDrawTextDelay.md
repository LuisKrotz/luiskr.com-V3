[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-layout](../README.md) / calcDrawTextDelay

```ts
function calcDrawTextDelay(totalChars, targetDurationMs?): number;
```

Defined in: [core/utils/wasm/wasm-layout.ts:146](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-layout.ts#L146)

Per-character draw interval sized so the whole text finishes within
targetDurationMs — targetDurationMs/totalChars, clamped between
DRAW_DELAY_MIN_MS (long texts still complete on time) and
DRAW_DELAY_MAX_MS (short texts don't stall). Rounded so the CSS delay
stays integer milliseconds.

## Parameters

### totalChars

`number`

Total character count across the text run.

### targetDurationMs?

`number` = `DRAW_TIMINGS.DRAW_TARGET_MS`

Budget for the whole stagger, in ms.

## Returns

`number`

Per-char delay in ms.
