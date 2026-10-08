[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/editors/projects](../README.md) / CMS\_PROJECTS\_CLASSES

```ts
const CMS_PROJECTS_CLASSES: Readonly<{
  CMS_SECTION_CARD: "cms-section-card";
  CMS_MEDIA_ITEM: "cms-media-item";
  CMS_MEDIA_THUMB: "cms-media-thumb";
  CMS_MEDIA_FIELDS: "cms-media-fields";
  CMS_COVER_LAYOUT: "cms-cover-layout";
  CMS_COVER_THUMB: "cms-cover-thumb";
  CMS_COVER_FIELDS: "cms-cover-fields";
  CMS_FIELD_GROUP_SMALL: "cms-field-group--small";
  CMS_CARD_HEADER: "cms-card--header";
  CMS_CHECKBOX_LABEL: "cms-checkbox-label";
  CMS_PROJECTS_MANAGER: "cms-projects-manager";
  CMS_SECTIONS_LIST: "cms-sections-list";
  SEC_UP: "sec-up-btn";
  SEC_DOWN: "sec-down-btn";
  SEC_DEL: "sec-del-btn";
  SEC_ADD_TEXT: "sec-add-text";
  SEC_ADD_MEDIA: "sec-add-media";
  SEC_TEXT_INPUT: "sec-text-input";
  SEC_TEXT_DEL: "sec-text-del";
  MEDIA_SRC: "media-src";
  MEDIA_LABEL: "media-label";
  MEDIA_TYPE: "media-type";
  MEDIA_W: "media-w";
  MEDIA_H: "media-h";
  MEDIA_DEL: "media-del";
}>;
```

Defined in: [cms/tokens/editors/projects.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/editors/projects.ts#L15)

Frozen cms projects class-name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
