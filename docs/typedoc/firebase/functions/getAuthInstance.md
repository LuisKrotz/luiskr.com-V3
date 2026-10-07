[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [firebase](../README.md) / getAuthInstance

```ts
function getAuthInstance(): Promise<Auth>
```

Defined in: [src/firebase.ts:69](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/firebase.ts#L69)

Lazily imports firebase/auth once and returns the shared Auth instance.
Concurrent callers share _authPromise so the chunk is fetched exactly once.

## Returns

`Promise`\<`Auth`\>
