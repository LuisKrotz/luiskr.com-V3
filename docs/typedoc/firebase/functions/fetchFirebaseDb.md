[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [firebase](../README.md) / fetchFirebaseDb

```ts
function fetchFirebaseDb(path): Promise<DbSnapshot>
```

Defined in: [src/firebase.ts:142](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/firebase.ts#L142)

Lightweight HTTP REST reader for the Realtime Database: GETs
`<db>/<path>.json` and wraps the payload in a snapshot-shaped
{ exists(), val() } object so callers match the SDK API.

Cache order: in-flight promise map → sessionStorage (survives route
changes within the tab) → network → SDK get() fallback on REST failure.

## Parameters

### path

`string`

## Returns

`Promise`\<[`DbSnapshot`](../interfaces/DbSnapshot.md)\>
