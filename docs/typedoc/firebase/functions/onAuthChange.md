[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [firebase](../README.md) / onAuthChange

```ts
function onAuthChange(callback): Promise<Unsubscribe>
```

Defined in: [src/firebase.ts:119](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/firebase.ts#L119)

Subscribes to auth state after lazily loading firebase/auth.

## Parameters

### callback

(`_user`) => `void`

## Returns

`Promise`\<`Unsubscribe`\>

the SDK's unsubscribe function
