[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/component-keys](../README.md) / SOURCE\_COMPONENT\_KEYS

```ts
const SOURCE_COMPONENT_KEYS: Readonly<{
  SOURCE_LABEL: "source-code.label";
  SOURCE_LINK: "source-code.link";
}>;
```

Defined in: [core/tokens/data/component-keys.ts:51](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/component-keys.ts#L51)

Frozen source component key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
