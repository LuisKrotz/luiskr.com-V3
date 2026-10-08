[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/fields/form](../README.md) / CMS\_FORM\_CLASSES

```ts
const CMS_FORM_CLASSES: Readonly<{
  CMS_FIELD_GROUP: "cms-field-group";
  CMS_FIELD_ROW: "cms-field-row";
  CMS_SUBSECTION: "cms-subsection";
  CMS_SUBSECTION_HEADER: "cms-subsection-header";
  CMS_SUBSECTION_TITLE: "cms-subsection-title";
  CMS_LABEL: "cms-label";
  CMS_INPUT: "cms-input";
  CMS_TEXTAREA: "cms-textarea";
  CMS_SELECT: "cms-select";
  CMS_HINT: "cms-hint";
}>;
```

Defined in: [cms/tokens/fields/form.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/fields/form.ts#L14)

Frozen cms form class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
