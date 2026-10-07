[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/ids/dialogs](../README.md) / DIALOG\_IDS

```ts
const DIALOG_IDS: Readonly<{
  LANG_DIALOG_TITLE: 'lang-dialog-title'
  PREF_TITLE: 'pref-title'
}>
```

Defined in: [src/core/tokens/ids/dialogs.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/ids/dialogs.ts#L14)

Frozen dialog element-id map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
