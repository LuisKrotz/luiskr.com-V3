[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/utils/notify](../README.md) / notifyError

```ts
function notifyError(opts?): Promise<false | "native" | "toast">;
```

Defined in: [core/utils/notify.ts:193](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/notify.ts#L193)

Generic failure shortcut — the localized "something went wrong" string.
Used by global handlers where the raw error detail belongs in the devlog
buffer (`core/devlog.ts`), not on screen.

## Parameters

### opts?

[`NotifyOpts`](../interfaces/NotifyOpts.md) = `{}`

## Returns

`Promise`\<`false` \| `"native"` \| `"toast"`\>
