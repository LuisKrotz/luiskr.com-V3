[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/admin](../README.md) / ADMIN\_CLASSES

```ts
const ADMIN_CLASSES: Readonly<{
  ADMIN_LOGIN_WRAPPER: "admin-login-wrapper";
  ADMIN_LOGIN_CARD: "admin-login-card";
  ADMIN_TITLE: "admin-title";
  ADMIN_SUBTITLE: "admin-subtitle";
  ADMIN_ERROR_MSG: "admin-error-msg";
  GOOGLE_AUTH_BTN: "google-auth-btn";
  GOOGLE_ICON: "google-icon";
}>;
```

Defined in: [core/tokens/classes/admin.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/admin.ts#L14)

Admin-login view classes. The `ADMIN_*` entries compose the `admin` BEM
block; `GOOGLE_AUTH_BTN`/`GOOGLE_ICON` are standalone blocks (different
block prefix) since Google's sign-in widget styling is applied to those
nodes and must not inherit admin-* selectors.
