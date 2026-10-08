[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/utils/data/db](../README.md) / warmBootstrap

```ts
function warmBootstrap(locale): void;
```

Defined in: [core/utils/data/db.ts:93](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/utils/data/db.ts#L93)

Starts downloading the core snapshot chunk for a locale right away so the
first render does not wait for an extra network hop after the route chunk.

## Parameters

### locale

`string`

## Returns

`void`
