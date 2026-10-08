[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/about](../README.md) / ABOUT\_CLASSES

```ts
const ABOUT_CLASSES: Readonly<{
  ABOUT: "about";
  ABOUT_TITLE: "about-title";
  ABOUT_PROFILE_SECTION: "about-profile-section";
  ABOUT_PROFILE_PICTURE: "about-profile-picture";
  ABOUT_PROFILE_PICTURE_IMG: "about-profile-picture-img";
  ABOUT_PROFILE_PICTURE_PLACEHOLDER: "about-profile-picture-placeholder";
  ABOUT_PROFILE_TEXT: "about-profile-text";
  ABOUT_PROFILE_TEXT_COL: "about-profile-text-col";
  ABOUT_ITEM: "about-item";
  ABOUT_ITEM_TEXT: "about-item-text";
  ABOUT_SIDE_INFO: "about-side-info";
  ABOUT_SIDE_INFO_SUMMARY: "about-side-info-summary";
  ABOUT_SIDE_INFO_CHEVRON: "about-side-info-chevron";
}>;
```

Defined in: [core/tokens/classes/about.ts:19](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/about.ts#L19)

Frozen about class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
