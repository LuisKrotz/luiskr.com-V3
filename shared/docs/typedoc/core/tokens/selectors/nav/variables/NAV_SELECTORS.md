[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/selectors/nav](../README.md) / NAV\_SELECTORS

```ts
const NAV_SELECTORS: Readonly<{
  NAV_MENU_MODAL: ".nav-menu-modal";
  NAV_MENU_MODAL_FALLBACK: ".nav-menu-modal-fallback";
  NAV_LOGO_BTN: ".nav-logo-btn";
  NAV_ABOUT_BTN: ".nav-about-btn";
  NAV_ACTION_BTN: ".nav-action-btn";
  NAV_PREF_BTN: ".nav-pref-btn";
  NAV_LANG_OPEN_BTN: ".nav-lang-open-btn";
  NAV_LINK: ".nav-link";
}>;
```

Defined in: [core/tokens/selectors/nav.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/selectors/nav.ts#L13)

Frozen nav selector map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
