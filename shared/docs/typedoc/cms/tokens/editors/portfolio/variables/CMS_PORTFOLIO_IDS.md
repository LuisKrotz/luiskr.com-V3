[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/editors/portfolio](../README.md) / CMS\_PORTFOLIO\_IDS

```ts
const CMS_PORTFOLIO_IDS: Readonly<{
  ADD_ITEM: "btn-add-item";
  SYNC_ITEMS: "btn-sync-items";
  SAVE_ITEMS: "btn-save-items";
  SELECT_LANG: "select-lang";
}>;
```

Defined in: [cms/tokens/editors/portfolio.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/editors/portfolio.ts#L48)

Frozen cms portfolio element-id map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
