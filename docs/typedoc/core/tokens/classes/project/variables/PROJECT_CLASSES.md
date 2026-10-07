[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/classes/project](../README.md) / PROJECT\_CLASSES

```ts
const PROJECT_CLASSES: Readonly<{
  PROJECT: 'project'
}>
```

Defined in: [src/core/tokens/classes/project.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/classes/project.ts#L54)

Frozen project class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
