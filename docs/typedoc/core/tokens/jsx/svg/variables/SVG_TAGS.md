[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/jsx/svg](../README.md) / SVG\_TAGS

```ts
const SVG_TAGS: Readonly<Set<string>>
```

Defined in: [src/core/tokens/jsx/svg.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/jsx/svg.ts#L18)

Tag names that require `createElementNS(SVG_NS, tag)` — the `h()` JSX
factory consults this set; any tag not listed goes through the HTML
path. Covers the full SVG2 tag vocabulary so consumers never maintain
their own lists.
