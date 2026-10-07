[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/jsx](../README.md) / Fragment

```ts
function Fragment(props?): DocumentFragment
```

Defined in: [src/core/jsx.ts:148](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/jsx.ts#L148)

JSX Fragment factory — groups children without a wrapper element.
Returns a DocumentFragment whose children move into the parent on append
(the fragment itself is empty afterwards, which is intended).

## Parameters

### props?

\| \{
`children?`: `unknown`;
\}
\| `null`

## Returns

`DocumentFragment`
