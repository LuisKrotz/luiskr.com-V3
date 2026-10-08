[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/auth](../README.md) / AUTH\_STRINGS

```ts
const AUTH_STRINGS: Readonly<{
  ERR_CANCELLED_POPUP: "auth/cancelled-popup-request";
  ERR_POPUP_CLOSED: "auth/popup-closed-by-user";
  ERR_POPUP_BLOCKED: "auth/popup-blocked";
  ERR_INTERNAL: "auth/internal-error";
  ERR_STORAGE_UNSUPPORTED: "auth/web-storage-unsupported";
  ERR_ENV_UNSUPPORTED: "auth/operation-not-supported-in-this-environment";
}>;
```

Defined in: [core/tokens/strings/auth.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/auth.ts#L14)

Frozen auth string map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
