[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/app](../README.md) / APP\_CLASSES

```ts
const APP_CLASSES: Readonly<{
  PROGRESS_BAR: "progress-bar";
  PROGRESS_BAR_ACTIVE: "progress-bar--active";
  PROGRESS_BAR_DONE: "progress-bar--done";
  VIEW_OUTLET: "view-outlet";
}>;
```

Defined in: [core/tokens/classes/app.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/app.ts#L14)

Frozen app class-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
