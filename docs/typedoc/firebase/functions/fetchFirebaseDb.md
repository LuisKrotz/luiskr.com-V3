[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [firebase](../README.md) / fetchFirebaseDb

```ts
function fetchFirebaseDb(path): Promise<DbSnapshot>
```

Defined in: [core/firebase.ts:160](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/firebase.ts#L160)

Lightweight HTTP REST reader for the Realtime Database: GETs
`<db>/<path>.json` and wraps the payload in a snapshot-shaped
{ exists(), val() } object so callers match the SDK API.

Cache order: in-flight promise map → sessionStorage (survives route
changes within the tab) → network → SDK get() fallback on REST failure.

## Parameters

### path

`string`

RTDB path — leading slash stripped for URL safety.

## Returns

`Promise`\<[`DbSnapshot`](../interfaces/DbSnapshot.md)\>

Snapshot-shaped {exists, val} wrapping the JSON payload.
