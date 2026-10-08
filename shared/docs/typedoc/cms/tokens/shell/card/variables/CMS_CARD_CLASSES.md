[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/shell/card](../README.md) / CMS\_CARD\_CLASSES

```ts
const CMS_CARD_CLASSES: Readonly<{
  CMS_CARD: "cms-card";
  CMS_CARD_TITLE: "cms-card-title";
  CMS_CARD_SUBTITLE: "cms-card-subtitle";
  CMS_SECTION_HEADER: "cms-section-header";
  CMS_SECTION_TITLE: "cms-section-title";
}>;
```

Defined in: [cms/tokens/shell/card.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/shell/card.ts#L14)

Frozen cms card class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
