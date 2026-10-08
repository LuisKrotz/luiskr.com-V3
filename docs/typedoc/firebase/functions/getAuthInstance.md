[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [firebase](../README.md) / getAuthInstance

```ts
function getAuthInstance(): Promise<Auth>
```

Defined in: [core/firebase.ts:77](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/firebase.ts#L77)

Lazily imports firebase/auth once and returns the shared Auth instance.
Concurrent callers share _authPromise so the chunk is fetched exactly once.

## Returns

`Promise`\<`Auth`\>

The Auth instance bound to `app`.
