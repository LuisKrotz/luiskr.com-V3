[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/firebase](../README.md) / getAuthInstance

```ts
function getAuthInstance(): Promise<Auth>;
```

Defined in: [core/firebase.ts:78](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/firebase.ts#L78)

Lazily imports firebase/auth once and returns the shared Auth instance.
Concurrent callers share _authPromise so the chunk is fetched exactly once.

## Returns

`Promise`\<`Auth`\>

The Auth instance bound to `app`.
