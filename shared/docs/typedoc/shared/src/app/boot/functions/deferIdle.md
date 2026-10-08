[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [shared/src/app/boot](../README.md) / deferIdle

```ts
function deferIdle(cb): void;
```

Defined in: [shared/src/app/boot.ts:27](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/shared/src/app/boot.ts#L27)

Schedules non-urgent work during idle time; falls back to a short
setTimeout on engines without requestIdleCallback. Evaluated per call
so the probe always reflects the live environment.

## Parameters

### cb

() => `void`

## Returns

`void`
