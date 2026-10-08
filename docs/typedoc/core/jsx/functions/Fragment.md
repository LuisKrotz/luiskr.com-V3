[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/jsx](../README.md) / Fragment

```ts
function Fragment(props?): DocumentFragment
```

Defined in: [core/jsx.ts:159](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/jsx.ts#L159)

JSX Fragment factory — groups children without a wrapper element.
Returns a DocumentFragment whose children move into the parent on append
(the fragment itself is empty afterwards, which is intended — MDN: the
fragment's children are moved, not copied, into the insertion point).

## Parameters

### props?

\| \{
`children?`: `unknown`;
\}
\| `null`

`{ children }` bag emitted by the JSX transform.

## Returns

`DocumentFragment`

Populated DocumentFragment.
