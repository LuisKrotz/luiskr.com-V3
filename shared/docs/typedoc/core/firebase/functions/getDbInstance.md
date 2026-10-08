[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/firebase](../README.md) / getDbInstance

```ts
function getDbInstance(): Promise<Database>;
```

Defined in: [core/firebase.ts:100](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/firebase.ts#L100)

Lazily imports firebase/database once and returns the shared RTDB
instance. Only needed by the CMS write path — public reads use REST.

## Returns

`Promise`\<`Database`\>

The Database instance bound to `app`.
