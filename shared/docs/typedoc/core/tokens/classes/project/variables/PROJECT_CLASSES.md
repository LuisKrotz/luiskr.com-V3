[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/project](../README.md) / PROJECT\_CLASSES

```ts
const PROJECT_CLASSES: Readonly<{
  PROJECT: "project";
}>;
```

Defined in: [core/tokens/classes/project.ts:57](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/project.ts#L57)

Frozen project class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
