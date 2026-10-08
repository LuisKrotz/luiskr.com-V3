[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/tokens/primitives](../README.md) / KEYS

```ts
const KEYS: Readonly<{
  ESCAPE: "Escape";
  ENTER: "Enter";
  SPACE: " ";
  ARROW_LEFT: "ArrowLeft";
  ARROW_RIGHT: "ArrowRight";
  ARROW_UP: "ArrowUp";
  ARROW_DOWN: "ArrowDown";
}>;
```

Defined in: [core/tokens/primitives.ts:47](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/primitives.ts#L47)

Frozen keys key map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
