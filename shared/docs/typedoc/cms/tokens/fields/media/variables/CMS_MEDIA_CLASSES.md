[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/fields/media](../README.md) / CMS\_MEDIA\_CLASSES

```ts
const CMS_MEDIA_CLASSES: Readonly<{
  CMS_DROPZONE_OVER: "cms-dropzone--over";
  CMS_DROPZONE_ICON: "cms-dropzone-icon";
  CMS_MEDIA_LIST: "cms-media-list";
  CMS_MEDIA_LIST_ERRORS: "cms-media-list cms-media-list--errors";
  CMS_MEDIA_LIST_ROW: "cms-media-list-row";
  CMS_MEDIA_LIST_NAME: "cms-media-list-name";
  CMS_MEDIA_LIST_SIZE: "cms-media-list-size";
  CMS_MEDIA_LIST_GROUP: "cms-media-list-group";
  CMS_MEDIA_LIST_OUT: "cms-media-list-out";
  CMS_MEDIA_LIST_ERROR: "cms-media-list-error";
  CMS_LIST_HEAD: "cms-list-head";
  CMS_BTN_ROW: "cms-btn-row";
  CMS_LOADER_ROW: "cms-loader-row";
  CMS_SPINNER: "cms-spinner";
  CMS_PROGRESS: "cms-progress";
  CMS_ERROR_TEXT: "cms-error-text";
}>;
```

Defined in: [cms/tokens/fields/media.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/fields/media.ts#L15)

Frozen cms media class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
