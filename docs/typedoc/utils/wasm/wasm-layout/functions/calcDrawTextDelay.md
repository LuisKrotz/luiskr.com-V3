[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-layout](../README.md) / calcDrawTextDelay

```ts
function calcDrawTextDelay(totalChars, targetDurationMs?): number
```

Defined in: [src/utils/wasm/wasm-layout.ts:146](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/utils/wasm/wasm-layout.ts#L146)

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
