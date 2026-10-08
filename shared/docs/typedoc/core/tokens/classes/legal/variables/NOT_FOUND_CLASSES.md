[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/legal](../README.md) / NOT\_FOUND\_CLASSES

```ts
const NOT_FOUND_CLASSES: Readonly<{
  NOT_FOUND: "not-found";
  NOT_FOUND_TITLE: "not-found-title";
  NOT_FOUND_SUBTITLE: "not-found-subtitle";
  NOT_FOUND_LINK: "not-found-link";
}>;
```

Defined in: [core/tokens/classes/legal.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/legal.ts#L23)

Frozen not found class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
