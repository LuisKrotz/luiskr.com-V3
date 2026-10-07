[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [routes/parse-path](../README.md) / parsePath

```ts
function parsePath(pathname): RouteDescriptor
```

Defined in: [src/routes/parse-path.ts:89](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/parse-path.ts#L89)

Pure resolution: pathname → route descriptor { name, view, lang,
path, meta, params }. meta.scrollTo triggers a post-nav smooth-scroll
to that element id.

## Parameters

### pathname

`string`

## Returns

[`RouteDescriptor`](../../types/interfaces/RouteDescriptor.md)
