[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/ids/app](../README.md) / APP\_IDS

```ts
const APP_IDS: Readonly<{
  APP: "app";
  MAIN: "main";
  MAIN_CONTENT: "main-content";
  VIEW_OUTLET: "view-outlet";
}>;
```

Defined in: [core/tokens/ids/app.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/ids/app.ts#L13)

Frozen app element-id map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
