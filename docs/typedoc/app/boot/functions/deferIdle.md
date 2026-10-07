[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [app/boot](../README.md) / deferIdle

```ts
function deferIdle(cb): void
```

Defined in: [src/app/boot.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/app/boot.ts#L27)

Schedules non-urgent work during idle time; falls back to a short
setTimeout on engines without requestIdleCallback. Evaluated per call
so the probe always reflects the live environment.

## Parameters

### cb

() => `void`

## Returns

`void`
