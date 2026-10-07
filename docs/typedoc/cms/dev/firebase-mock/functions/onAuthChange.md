[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/dev/firebase-mock](../README.md) / onAuthChange

```ts
function onAuthChange(cb): Promise<() => void>
```

Defined in: [src/cms/dev/firebase-mock.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/dev/firebase-mock.ts#L116)

Mock onAuthChange — immediately reports the signed-in mock user and
returns a no-op unsubscribe.

## Parameters

### cb

(`_user`) => `void`

The auth-state callback.

## Returns

`Promise`\<() => `void`\>
