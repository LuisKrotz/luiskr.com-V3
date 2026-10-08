[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/motion/gpu](../README.md) / UA\_PATTERNS

```ts
const UA_PATTERNS: Readonly<{
  MOBILE_UA: RegExp;
}>;
```

Defined in: [core/tokens/motion/gpu.ts:30](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/motion/gpu.ts#L30)

Frozen ua map — sole declaration site for these tokens; consumers read members and never
re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.
