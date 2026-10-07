[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [utils/notify](../README.md) / notify

```ts
function notify(message, opts?): Promise<false | 'native' | 'toast'>
```

Defined in: [src/utils/notify.ts:150](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/notify.ts#L150)

Surfaces a message to the user — native notification when allowed, the
in-page toast otherwise.

## Parameters

### message

`string`

body copy (localized by the caller)

### opts?

[`NotifyOpts`](../interfaces/NotifyOpts.md) = `{}`

## Returns

`Promise`\<`false` \| `"native"` \| `"toast"`\>

which surface took the message
