[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/fields/buttons](../README.md) / CMS\_BUTTON\_CLASSES

```ts
const CMS_BUTTON_CLASSES: Readonly<{
  CMS_BTN: "cms-btn";
  CMS_BTN_GROUP: "cms-btn-group";
  CMS_BTN_PRIMARY: "cms-btn cms-btn--primary";
  CMS_BTN_DANGER: "cms-btn cms-btn--danger";
  CMS_BTN_SECONDARY: "cms-btn cms-btn--secondary";
  CMS_BTN_PRESET: "cms-btn--preset";
  CMS_BTN_ACTIVE: "cms-btn--active";
}>;
```

Defined in: [cms/tokens/fields/buttons.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/fields/buttons.ts#L14)

Frozen cms button class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
