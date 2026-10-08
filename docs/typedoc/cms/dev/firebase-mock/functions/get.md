[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/dev/firebase-mock](../README.md) / get

```ts
function get(r): Promise<{
  exists: () => boolean
  val: () => unknown
}>
```

Defined in: [cms/dev/firebase-mock.ts:77](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/cms/dev/firebase-mock.ts#L77)

Mock of firebase/database `get()` — resolves the ref's path in the
snapshot and returns the SDK-shaped {exists, val} result.

## Parameters

### r

`MockRef`

The ref to read.

## Returns

`Promise`\<\{
`exists`: () => `boolean`;
`val`: () => `unknown`;
\}\>

A snapshot-shaped promise.
