[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/debug/params](../README.md) / debugParams

```ts
function debugParams(): string[]
```

Defined in: [src/core/debug/params.ts:28](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/debug/params.ts#L28)

All `debug` values on the current URL (empty outside a windowed context).
`getAll` (not `get`) because the param is repeatable — `?debug=a&debug=b`
must surface both flags.

## Returns

`string`[]

Every `?debug=` value in order.
