[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/editors/projects](../README.md) / CMS\_PROJECTS\_IDS

```ts
const CMS_PROJECTS_IDS: Readonly<{
  BTN_CREATE: "btn-create-proj";
  BTN_DELETE: "btn-delete-proj";
  BTN_SAVE: "btn-save-proj";
  BTN_ADD_SECTION: "btn-add-section";
  SELECT_LANG: "select-proj-lang";
  SELECT_KEY: "select-proj-key";
  PROJ_TITLE: "proj-title-input";
  PROJ_FOLDER: "proj-folder-input";
  PROJ_NOINDEX: "proj-noindex";
  COVER_SRC: "cover-src-input";
  COVER_LABEL: "cover-label-input";
  COVER_ISVIDEO: "cover-isvideo";
  COVER_W: "cover-w-input";
  COVER_H: "cover-h-input";
}>;
```

Defined in: [cms/tokens/editors/projects.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/editors/projects.ts#L48)

Frozen cms projects element-id map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
