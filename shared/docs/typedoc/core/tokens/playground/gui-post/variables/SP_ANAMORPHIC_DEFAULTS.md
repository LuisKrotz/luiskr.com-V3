[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-post](../README.md) / SP\_ANAMORPHIC\_DEFAULTS

```ts
const SP_ANAMORPHIC_DEFAULTS: Readonly<{
  ENABLED: false;
  INTENSITY: 0.5;
  THICKNESS: 2;
  SIZE: 0.2;
  COLOR: 16777215;
  INNER_FADE: 0.08;
  OUTER_FADE: 0.08;
}>;
```

Defined in: [core/tokens/playground/gui-post.ts:35](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-post.ts#L35)

Frozen sp anamorphic map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
