[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/auth](../README.md) / AUTH\_REDIRECT\_FALLBACK\_CODES

```ts
const AUTH_REDIRECT_FALLBACK_CODES: readonly string[];
```

Defined in: [core/tokens/strings/auth.ts:31](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/auth.ts#L31)

Codes where the popup handshake cannot run in the current browser
environment (popup blockers, COOP window.closed blocking, partitioned
storage, unsupported contexts) — these retry via signInWithRedirect.
User-cancellation codes are deliberately excluded.
