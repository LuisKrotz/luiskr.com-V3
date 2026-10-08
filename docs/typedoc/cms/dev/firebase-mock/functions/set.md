[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/dev/firebase-mock](../README.md) / set

```ts
function set(r, v): Promise<void>
```

Defined in: [cms/dev/firebase-mock.ts:89](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/cms/dev/firebase-mock.ts#L89)

Mock of firebase/database `set()` — logs the write; nothing persists so
dev sessions stay reproducible against the committed snapshot.

## Parameters

### r

`MockRef`

Target ref.

### v

`unknown`

Value that would be written.

## Returns

`Promise`\<`void`\>
