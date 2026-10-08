[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/routes](../README.md) / ROUTE\_STRINGS

```ts
const ROUTE_STRINGS: Readonly<{
  ADMIN: "admin";
  CMS: "cms";
  ADMIN_TITLE: "Admin Login";
  CMS_TITLE: "CMS Dashboard";
  PORTFOLIO: "portfolio";
  PRIVACY: "privacy";
  GDPR: "gdpr";
  TERMS: "terms";
  TERMS_OF_USE: "terms-of-use";
  PRIVACY_POLICY: "privacy-policy";
  ABOUT: "about";
  CONTACT: "contact";
}>;
```

Defined in: [core/tokens/strings/routes.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/routes.ts#L20)

Frozen route/CMS name-string map — bare names (no slashes) used as title
fragments, route names, and CMS keys. Composes `_B_*`/`_K_*` fragments
from base.ts where the name doubles as a block/key token.
