[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/data/db](../README.md) / fetchFirebaseDb

```ts
function fetchFirebaseDb(path, onUpdate?): Promise<DbSnapshot>;
```

Defined in: [core/utils/data/db.ts:175](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/data/db.ts#L175)

Reads a database node.

Static first: translation paths resolve instantly from the build-time
snapshot of database.json, then revalidate against Firebase in the
background. When the live value differs, the cache is updated and
`onUpdate(snapshot)` is called so the caller can re-render with CMS edits
made after the last deploy. Non-translation paths go straight to the
network with the localStorage copy as offline fallback.

## Parameters

### path

`string`

### onUpdate?

(`_snapshot`) => `void`

## Returns

`Promise`\<[`DbSnapshot`](../interfaces/DbSnapshot.md)\>
