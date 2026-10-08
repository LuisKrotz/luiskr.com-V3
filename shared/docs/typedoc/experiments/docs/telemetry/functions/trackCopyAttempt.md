[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/telemetry](../README.md) / trackCopyAttempt

```ts
function trackCopyAttempt(kind, path): void;
```

Defined in: [experiments/docs/telemetry.ts:49](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/telemetry.ts#L49)

Posts one copy-attempt record. Fire-and-forget: the guard never blocks
the UI on the POST (beacon for unload safety, fetch keepalive fallback).

## Parameters

### kind

[`CopyAttemptKind`](../type-aliases/CopyAttemptKind.md)

Which guard surface fired.

### path

`string`

The docs path being viewed (manifest-relative).

## Returns

`void`
