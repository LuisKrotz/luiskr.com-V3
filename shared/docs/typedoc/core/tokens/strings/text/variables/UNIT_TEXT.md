[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/text](../README.md) / UNIT\_TEXT

```ts
const UNIT_TEXT: Readonly<{
  DOT_SEP: "•";
  KB_S: "KB/s";
  MS: "ms";
  MB: "MB";
  DASH: "—";
}>;
```

Defined in: [core/tokens/strings/text.ts:36](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/text.ts#L36)

Frozen unit UI text map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
