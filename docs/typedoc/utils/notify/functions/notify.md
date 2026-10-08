[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [utils/notify](../README.md) / notify

```ts
function notify(message, opts?): Promise<false | 'native' | 'toast'>
```

Defined in: [core/utils/notify.ts:150](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/utils/notify.ts#L150)

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
