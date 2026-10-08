[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/nav](../README.md) / NAV\_MENU\_CLASSES

```ts
const NAV_MENU_CLASSES: Readonly<{
  NAV_MENU_MODAL: "nav-menu-modal";
  NAV_MENU_MODAL_OPEN: "nav-menu-modal--open";
  NAV_MENU_MODAL_CANVAS: "nav-menu-modal-canvas";
  NAV_MENU_MODAL_HEADER: "nav-menu-modal-header";
  NAV_MENU_MODAL_CONTENT: "nav-menu-modal-content";
  NAV_MENU_MODAL_ITEM: "nav-menu-modal-item";
  NAV_MENU_MODAL_ITEM_ACTIVE: "nav-menu-modal-item--active";
  NAV_MENU_MODAL_FLAG: "nav-menu-modal-flag";
  NAV_MENU_MODAL_CLOSE: "nav-menu-modal-close";
  NAV_MENU_MODAL_CLOSING: "nav-menu-modal--closing";
  NAV_MENU_MODAL_SETTLED: "nav-menu-modal--settled";
  NAV_MENU_MODAL_FALLBACK: "nav-menu-modal-fallback";
  NAV_MENU_MODAL_GL_FALLBACK: "nav-menu-modal--gl-fallback";
}>;
```

Defined in: [core/tokens/classes/nav.ts:62](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/nav.ts#L62)

Frozen nav menu class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
