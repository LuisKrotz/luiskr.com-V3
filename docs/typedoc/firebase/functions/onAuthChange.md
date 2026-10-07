[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [firebase](../README.md) / onAuthChange

```ts
function onAuthChange(callback): Promise<Unsubscribe>
```

Defined in: [src/firebase.ts:135](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/firebase.ts#L135)

Subscribes to auth state after lazily loading firebase/auth.

## Parameters

### callback

(`_user`) => `void`

Invoked with the User (or null on sign-out) on every auth transition.

## Returns

`Promise`\<`Unsubscribe`\>

the SDK's unsubscribe function
