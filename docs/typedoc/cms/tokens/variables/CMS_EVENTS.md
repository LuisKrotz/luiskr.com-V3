[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [cms/tokens](../README.md) / CMS\_EVENTS

```ts
const CMS_EVENTS: Readonly<{
  NOTIFY: 'notify'
  AUTH_CHANGED: 'cms-auth-changed'
}>
```

Defined in: [src/cms/tokens.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/tokens.ts#L60)

Frozen cms event-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
