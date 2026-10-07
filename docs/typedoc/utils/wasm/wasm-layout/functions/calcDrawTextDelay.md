[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-layout](../README.md) / calcDrawTextDelay

```ts
function calcDrawTextDelay(totalChars, targetDurationMs?): number
```

Defined in: [src/utils/wasm/wasm-layout.ts:86](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/wasm/wasm-layout.ts#L86)

Per-character draw interval sized so the whole text finishes within targetDurationMs (clamped 1–22ms).

## Parameters

### totalChars

`number`

### targetDurationMs?

`number` = `1500`

## Returns

`number`
