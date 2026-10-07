[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/events/dom](../README.md) / FORM\_EVENTS

```ts
const FORM_EVENTS: Readonly<{
  CHANGE: 'change'
  INPUT: 'input'
  SUBMIT: 'submit'
}>
```

Defined in: [src/core/tokens/events/dom.ts:78](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/events/dom.ts#L78)

Frozen form event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
