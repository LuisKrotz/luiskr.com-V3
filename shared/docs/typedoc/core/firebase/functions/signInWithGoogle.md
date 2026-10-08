[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/firebase](../README.md) / signInWithGoogle

```ts
function signInWithGoogle(): Promise<void | UserCredential>;
```

Defined in: [core/firebase.ts:120](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/firebase.ts#L120)

CMS login — Google OAuth popup. `prompt: 'select_account'` forces the
account chooser so a CMS editor isn't silently signed into a wrong Google account.
When the environment can't complete the popup handshake (popup blockers,
COOP window.closed blocking, partitioned web storage, unsupported
contexts — the AUTH_REDIRECT_FALLBACK_CODES set), retries transparently
via signInWithRedirect, which navigates away and never resolves.

## Returns

`Promise`\<`void` \| `UserCredential`\>

The SDK UserCredential, or nothing when the redirect fallback fires.
