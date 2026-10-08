[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/nav](../README.md) / NAV\_CLASSES

```ts
const NAV_CLASSES: Readonly<{
  NAV: "nav";
  NAV_LINK: "nav-link";
  NAV_LINK_ACTIVE: "router-link-exact-active";
  NAV_ON_DARK: "nav--on-dark";
  NAV_PLAYGROUND: "nav--playground";
  NAV_DESKTOP: "nav-desktop";
  NAV_DESKTOP_RIGHT: "nav-desktop-right";
  NAV_SEPARATOR: "nav-separator";
  NAV_MOBILE_STRIP: "nav-mobile-strip";
  NAV_LOGO_BTN: "nav-logo-btn";
  NAV_ABOUT_BTN: "nav-about-btn";
  NAV_ACTION_BTN: "nav-action-btn";
  NAV_PREF_BTN: "nav-pref-btn";
  NAV_LANG_OPEN_BTN: "nav-lang-open-btn";
  NAV_FLAG_WRAPPER: "nav-flag-wrapper";
  NAV_BACK: "back";
  NAV_SCROLL_UP: "scroll-up";
  NAV_SCROLL_DOWN: "scroll-down";
  NAV_ACTIVE: "active";
}>;
```

Defined in: [core/tokens/classes/nav.ts:20](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/nav.ts#L20)

Frozen nav class-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
