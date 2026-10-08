[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-post](../README.md) / SP\_FILM\_GRAIN\_DEFAULTS

```ts
const SP_FILM_GRAIN_DEFAULTS: Readonly<{
  ENABLED: false;
  INTENSITY: 0.25;
}>;
```

Defined in: [core/tokens/playground/gui-post.ts:84](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-post.ts#L84)

Frozen sp film grain map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
