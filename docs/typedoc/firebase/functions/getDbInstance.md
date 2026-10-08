[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [firebase](../README.md) / getDbInstance

```ts
function getDbInstance(): Promise<Database>
```

Defined in: [core/firebase.ts:99](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/firebase.ts#L99)

Lazily imports firebase/database once and returns the shared RTDB
instance. Only needed by the CMS write path — public reads use REST.

## Returns

`Promise`\<`Database`\>

The Database instance bound to `app`.
