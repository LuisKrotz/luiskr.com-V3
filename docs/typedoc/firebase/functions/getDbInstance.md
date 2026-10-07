[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [firebase](../README.md) / getDbInstance

```ts
function getDbInstance(): Promise<Database>
```

Defined in: [src/firebase.ts:88](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/firebase.ts#L88)

Lazily imports firebase/database once and returns the shared RTDB
instance. Only needed by the CMS write path — public reads use REST.

## Returns

`Promise`\<`Database`\>
