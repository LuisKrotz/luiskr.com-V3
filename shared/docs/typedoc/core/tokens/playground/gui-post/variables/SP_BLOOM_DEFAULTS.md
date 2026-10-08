[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-post](../README.md) / SP\_BLOOM\_DEFAULTS

```ts
const SP_BLOOM_DEFAULTS: Readonly<{
  ENABLED: false;
  STRENGTH: 0.1;
  RADIUS: 0.3;
  THRESHOLD: 0.9;
}>;
```

Defined in: [core/tokens/playground/gui-post.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-post.ts#L50)

Frozen sp bloom map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
