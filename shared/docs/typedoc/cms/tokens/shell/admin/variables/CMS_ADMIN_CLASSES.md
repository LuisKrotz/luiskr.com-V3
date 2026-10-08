[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/shell/admin](../README.md) / CMS\_ADMIN\_CLASSES

```ts
const CMS_ADMIN_CLASSES: Readonly<{
  ADMIN_LOGIN_WRAPPER: "admin-login-wrapper";
  ADMIN_LOGIN_CARD: "admin-login-card";
  ADMIN_LOGIN_TITLE: "admin-login-title";
  ADMIN_LOGIN_BTN: "admin-login-btn";
  ADMIN_TITLE: "admin-title";
  ADMIN_SUBTITLE: "admin-subtitle";
  GOOGLE_AUTH_BTN: "google-auth-btn";
  GOOGLE_ICON: "google-icon";
  ADMIN_ERROR_MSG: "admin-error-msg";
  TOAST_TEXT: "toast-text";
}>;
```

Defined in: [cms/tokens/shell/admin.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/shell/admin.ts#L14)

Frozen cms admin class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
