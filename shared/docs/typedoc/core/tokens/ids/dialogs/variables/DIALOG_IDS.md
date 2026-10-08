[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/ids/dialogs](../README.md) / DIALOG\_IDS

```ts
const DIALOG_IDS: Readonly<{
  LANG_DIALOG_TITLE: "lang-dialog-title";
  PREF_TITLE: "pref-title";
}>;
```

Defined in: [core/tokens/ids/dialogs.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/ids/dialogs.ts#L14)

Frozen dialog element-id map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
