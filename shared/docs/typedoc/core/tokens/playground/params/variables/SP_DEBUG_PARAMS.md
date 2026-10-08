[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/params](../README.md) / SP\_DEBUG\_PARAMS

```ts
const SP_DEBUG_PARAMS: Readonly<{
  RES_SCALE: "res-scale";
  SHOW_STATS: "show-stats";
}>;
```

Defined in: [core/tokens/playground/params.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/params.ts#L68)

Frozen sp debug parameter map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
