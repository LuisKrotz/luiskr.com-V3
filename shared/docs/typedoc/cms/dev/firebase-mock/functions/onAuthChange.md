[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/dev/firebase-mock](../README.md) / onAuthChange

```ts
function onAuthChange(cb): Promise<() => void>;
```

Defined in: [cms/dev/firebase-mock.ts:116](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/dev/firebase-mock.ts#L116)

Mock onAuthChange — immediately reports the signed-in mock user and
returns a no-op unsubscribe.

## Parameters

### cb

(`_user`) => `void`

The auth-state callback.

## Returns

`Promise`\<() => `void`\>
