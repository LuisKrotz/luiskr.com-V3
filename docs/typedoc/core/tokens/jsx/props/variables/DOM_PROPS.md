[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/jsx/props](../README.md) / DOM\_PROPS

```ts
const DOM_PROPS: Readonly<Set<string>>
```

Defined in: [src/core/tokens/jsx/props.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/tokens/jsx/props.ts#L54)

Properties that must be set via the DOM property (el[key] = val)
rather than el.setAttribute(key, val) so the browser reflects
the live state (e.g. slider thumb position, input text).
