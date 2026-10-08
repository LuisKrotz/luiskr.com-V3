[**luiskr.com**](../../../../../../README.md)

***

[luiskr.com](../../../../../../README.md) / [website/components/media/draw-text/trigger](../README.md) / registerOrdered

```ts
function registerOrdered(host): void;
```

Defined in: [website/components/media/draw-text/trigger.ts:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/website/components/media/draw-text/trigger.ts#L57)

Registers an ordered element in the reveal session. Idempotent —
setupTrigger re-runs on text/attr changes, the Set dedups.

## Parameters

### host

[`DrawText`](../../../DrawText/classes/DrawText.md)

The draw-text host element.

## Returns

`void`
