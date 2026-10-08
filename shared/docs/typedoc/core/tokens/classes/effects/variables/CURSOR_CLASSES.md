[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/effects](../README.md) / CURSOR\_CLASSES

```ts
const CURSOR_CLASSES: Readonly<{
  MAGNETIC_CURSOR: "magnetic-cursor";
  MAGNETIC_CURSOR_DOT: "magnetic-cursor-dot";
  MAGNETIC_CURSOR_HOVER: "magnetic-cursor--hover";
  MAGNETIC_CURSOR_HIDDEN: "magnetic-cursor--hidden";
}>;
```

Defined in: [core/tokens/classes/effects.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/effects.ts#L24)

Frozen cursor class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
