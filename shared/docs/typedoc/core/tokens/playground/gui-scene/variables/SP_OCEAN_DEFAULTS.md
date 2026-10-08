[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/playground/gui-scene](../README.md) / SP\_OCEAN\_DEFAULTS

```ts
const SP_OCEAN_DEFAULTS: Readonly<{
  ROUGHNESS: 0;
  METALNESS: 0;
}>;
```

Defined in: [core/tokens/playground/gui-scene.ts:50](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/playground/gui-scene.ts#L50)

Frozen sp ocean map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
