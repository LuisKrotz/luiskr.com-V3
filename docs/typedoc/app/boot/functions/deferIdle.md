[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [app/boot](../README.md) / deferIdle

```ts
function deferIdle(cb): void
```

Defined in: [src/app/boot.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/app/boot.ts#L27)

Schedules non-urgent work during idle time; falls back to a short
setTimeout on engines without requestIdleCallback. Evaluated per call
so the probe always reflects the live environment.

## Parameters

### cb

() => `void`

## Returns

`void`
