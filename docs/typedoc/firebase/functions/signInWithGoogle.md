[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [firebase](../README.md) / signInWithGoogle

```ts
function signInWithGoogle(): Promise<UserCredential>
```

Defined in: [core/firebase.ts:115](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/firebase.ts#L115)

CMS login — Google OAuth popup. `prompt: 'select_account'` forces the
account chooser so a CMS editor isn't silently signed into a wrong Google account.

## Returns

`Promise`\<`UserCredential`\>

The SDK UserCredential.
