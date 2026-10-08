[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/wasm/wasm-layout](../README.md) / calcEaseOutCubic

```ts
function calcEaseOutCubic(t): number;
```

Defined in: [core/utils/wasm/wasm-layout.ts:126](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/wasm/wasm-layout.ts#L126)

easeOutCubic easing — 1−(1−t)³: fast start, decelerating stop. Used for
menu/carousel transitions where motion should settle, not bounce.

## Parameters

### t

`number`

Progress fraction 0–1.

## Returns

`number`

Eased progress 0–1.
