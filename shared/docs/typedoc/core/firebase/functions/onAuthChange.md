[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/firebase](../README.md) / onAuthChange

```ts
function onAuthChange(callback): Promise<Unsubscribe>;
```

Defined in: [core/firebase.ts:156](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/firebase.ts#L156)

Subscribes to auth state after lazily loading firebase/auth.
First resolves a pending redirect sign-in (the signInWithGoogle popup
fallback) so the callback fires with the fresh session on return — a
failed redirect logs the error and falls through to the normal listener.

## Parameters

### callback

(`_user`) => `void`

Invoked with the User (or null on sign-out) on every auth transition.

## Returns

`Promise`\<`Unsubscribe`\>

the SDK's unsubscribe function
