[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [utils/notify](../README.md) / notifyError

```ts
function notifyError(opts?): Promise<false | 'native' | 'toast'>
```

Defined in: [src/utils/notify.ts:193](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/notify.ts#L193)

Generic failure shortcut — the localized "something went wrong" string.
Used by global handlers where the raw error detail belongs in the devlog
buffer (`core/devlog.ts`), not on screen.

## Parameters

### opts?

[`NotifyOpts`](../interfaces/NotifyOpts.md) = `{}`

## Returns

`Promise`\<`false` \| `"native"` \| `"toast"`\>
