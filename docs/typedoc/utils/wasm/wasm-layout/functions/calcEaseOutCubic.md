[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/wasm/wasm-layout](../README.md) / calcEaseOutCubic

```ts
function calcEaseOutCubic(t): number
```

Defined in: [core/utils/wasm/wasm-layout.ts:126](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/wasm/wasm-layout.ts#L126)

easeOutCubic easing — 1−(1−t)³: fast start, decelerating stop. Used for
menu/carousel transitions where motion should settle, not bounce.

## Parameters

### t

`number`

Progress fraction 0–1.

## Returns

`number`

Eased progress 0–1.
