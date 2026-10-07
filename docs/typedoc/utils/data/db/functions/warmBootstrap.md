[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [utils/data/db](../README.md) / warmBootstrap

```ts
function warmBootstrap(locale): void
```

Defined in: [src/utils/data/db.ts:93](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/utils/data/db.ts#L93)

Starts downloading the core snapshot chunk for a locale right away so the
first render does not wait for an extra network hop after the route chunk.

## Parameters

### locale

`string`

## Returns

`void`
