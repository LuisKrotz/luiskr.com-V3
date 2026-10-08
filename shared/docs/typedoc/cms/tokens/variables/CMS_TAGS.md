[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [cms/tokens](../README.md) / CMS\_TAGS

```ts
const CMS_TAGS: Readonly<{
  VIEW_ADMIN_LOGIN: "view-admin-login";
  VIEW_CMS_DASHBOARD: "view-cms-dashboard";
  CMS_PORTFOLIO_LIST: "cms-portfolio-list";
  CMS_PROJECTS_LIST: "cms-projects-list";
  CMS_ABOUT_EDITOR: "cms-about-editor";
  CMS_FOOTER_EDITOR: "cms-footer-editor";
  CMS_LANG_EDITOR: "cms-lang-editor";
  CMS_PLAYGROUND_EDITOR: "cms-playground-editor";
  CMS_MEDIA_CONVERTER: "cms-media-converter";
  CMS_DEPLOY_INFO: "cms-deploy-info";
}>;
```

Defined in: [cms/tokens.ts:42](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens.ts#L42)

Frozen cms element tag-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
