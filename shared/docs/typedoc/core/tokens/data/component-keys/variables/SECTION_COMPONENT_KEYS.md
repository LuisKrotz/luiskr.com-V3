[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/component-keys](../README.md) / SECTION\_COMPONENT\_KEYS

```ts
const SECTION_COMPONENT_KEYS: Readonly<{
  RELATED_TITLE: "related.title";
  CONTACT_TITLE: "contact.title";
}>;
```

Defined in: [core/tokens/data/component-keys.ts:61](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/component-keys.ts#L61)

Frozen section component key map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
