[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/ids/cms](../README.md) / CMS\_IDS

```ts
const CMS_IDS: Readonly<{
  CMS_ROOT: "cms";
}>;
```

Defined in: [core/tokens/ids/cms.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/ids/cms.ts#L13)

Frozen cms element-id map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
