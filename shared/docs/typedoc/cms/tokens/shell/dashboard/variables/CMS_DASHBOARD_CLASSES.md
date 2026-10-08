[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/shell/dashboard](../README.md) / CMS\_DASHBOARD\_CLASSES

```ts
const CMS_DASHBOARD_CLASSES: Readonly<{
  CMS_BADGE: "cms-badge";
  CMS_CONTAINER: "cms-container";
  CMS_HEADER: "cms-header";
  CMS_BRAND: "cms-brand";
  CMS_LOGO: "cms-logo";
  CMS_USER_INFO: "cms-user-info";
  CMS_AVATAR: "cms-avatar";
  CMS_EMAIL: "cms-email";
  CMS_LOGOUT_BTN: "cms-logout-btn";
  CMS_NAV_TABS: "cms-nav-tabs";
  CMS_TAB_BTN: "cms-tab-btn";
  CMS_MAIN_CONTENT: "cms-main-content";
  CMS_TOAST: "cms-toast";
}>;
```

Defined in: [cms/tokens/shell/dashboard.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/shell/dashboard.ts#L14)

Frozen cms dashboard class-name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
