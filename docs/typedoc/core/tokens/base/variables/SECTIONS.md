[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/tokens/base](../README.md) / SECTIONS

```ts
const SECTIONS: Readonly<{
  HOME: 'home'
  ABOUT: 'about'
  CONTACT: 'contact'
}>
```

Defined in: [src/core/tokens/base.ts:496](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/base.ts#L496)

Frozen sections map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
