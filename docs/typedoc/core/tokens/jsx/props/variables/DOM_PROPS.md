[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/jsx/props](../README.md) / DOM\_PROPS

```ts
const DOM_PROPS: Readonly<Set<string>>
```

Defined in: [src/core/tokens/jsx/props.ts:54](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/jsx/props.ts#L54)

Properties that must be set via the DOM property (el[key] = val)
rather than el.setAttribute(key, val) so the browser reflects
the live state (e.g. slider thumb position, input text).
