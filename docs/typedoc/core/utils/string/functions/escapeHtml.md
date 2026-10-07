[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/utils/string](../README.md) / escapeHtml

```ts
function escapeHtml(str): string
```

Defined in: [src/core/utils/string.ts:41](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/utils/string.ts#L41)

Escapes HTML-significant characters for safe insertion into innerHTML or
double-quoted attributes. `&` must be replaced first so the entities
emitted by the later replacements are not double-escaped.
Pure ESM utility function, tree-shakeable.

## Parameters

### str

`string`

— raw text that may contain &, <, >, ", '

## Returns

`string`

entity-escaped text safe for markup contexts
