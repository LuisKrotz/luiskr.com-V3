[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-scene](../README.md) / SP\_CLOUD\_SHADOW\_DEFAULTS

```ts
const SP_CLOUD_SHADOW_DEFAULTS: Readonly<{
  DISTANCE: 1.2;
  INTENSITY: 0.8;
  COLOR: 3358809;
}>;
```

Defined in: [core/tokens/playground/gui-scene.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-scene.ts#L39)

Frozen sp cloud shadow map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
