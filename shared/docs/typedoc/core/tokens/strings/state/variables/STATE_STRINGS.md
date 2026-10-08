[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/state](../README.md) / STATE\_STRINGS

```ts
const STATE_STRINGS: Readonly<{
  NONE: "none";
  BLOCK: "block";
  AUTO: "auto";
  SMOOTH: "smooth";
  INSTANT: "instant";
  TRUE: "true";
  FALSE: "false";
  GRANTED: "granted";
  DENIED: "denied";
  OPEN: "open";
  FIXED: "fixed";
  ABSOLUTE: "absolute";
  RELATIVE: "relative";
  HIDDEN: "hidden";
  HIGH: "high";
  DEFAULT: "default";
  LANDSCAPE: "landscape";
  SYSTEM: "system";
}>;
```

Defined in: [core/tokens/strings/state.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/state.ts#L14)

Frozen state string map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
