[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/editors/about](../README.md) / CMS\_ABOUT\_IDS

```ts
const CMS_ABOUT_IDS: Readonly<{
  SAVE: "btn-save-about";
  SYNC_PICTURE: "btn-sync-picture";
  SYNC_ALL: "btn-sync-all";
  GEN_GRAVATAR: "btn-gen-gravatar";
  SELECT_LANG: "select-about-lang";
  TITLE_INPUT: "about-title-input";
  MENTIONS_TITLE: "about-mentions-title";
  EMAIL_INPUT: "email-gravatar-input";
  SIZE_INPUT: "about-size-input";
  PIC_INPUT: "about-pic-input";
  GRAVATAR_PREVIEW: "gravatar-preview";
  ADD_MENTION: "btn-add-mention";
}>;
```

Defined in: [cms/tokens/editors/about.ts:44](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/editors/about.ts#L44)

Frozen cms about element-id map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
