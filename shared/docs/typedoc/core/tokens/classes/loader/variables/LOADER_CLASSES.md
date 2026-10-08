[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/loader](../README.md) / LOADER\_CLASSES

```ts
const LOADER_CLASSES: Readonly<{
  INTRO_LOADER: "intro-loader";
  INTRO_LOADER_PERCENT: "intro-loader-percent";
  INTRO_LOADER_TERMINAL: "intro-loader-terminal";
  INTRO_LOADER_LINE: "intro-loader-line";
  INTRO_LOADER_HIDDEN: "intro-loader--hidden";
}>;
```

Defined in: [core/tokens/classes/loader.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/loader.ts#L13)

Frozen loader class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
