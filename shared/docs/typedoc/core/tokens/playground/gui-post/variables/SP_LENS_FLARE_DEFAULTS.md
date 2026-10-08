[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-post](../README.md) / SP\_LENS\_FLARE\_DEFAULTS

```ts
const SP_LENS_FLARE_DEFAULTS: Readonly<{
  ENABLED: true;
  INTENSITY: 0.15;
}>;
```

Defined in: [core/tokens/playground/gui-post.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-post.ts#L25)

Frozen sp lens flare map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
