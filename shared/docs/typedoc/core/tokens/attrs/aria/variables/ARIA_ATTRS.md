[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/attrs/aria](../README.md) / ARIA\_ATTRS

```ts
const ARIA_ATTRS: Readonly<{
  ARIA_LABEL: "aria-label";
  ARIA_EXPANDED: "aria-expanded";
  ARIA_CONTROLS: "aria-controls";
  ARIA_LABELLEDBY: "aria-labelledby";
  ARIA_MODAL: "aria-modal";
  ARIA_HIDDEN: "aria-hidden";
  ARIA_LIVE: "aria-live";
  ARIA_PRESSED: "aria-pressed";
  ARIA_CHECKED: "aria-checked";
  POLITE: "polite";
  ROLE: "role";
  ROLE_DIALOG: "dialog";
  ROLE_GROUP: "group";
  ROLE_SWITCH: "switch";
  ROLE_BUTTON: "button";
  ROLE_NAVIGATION: "navigation";
  ROLE_ALERT: "alert";
  ROLE_STATUS: "status";
  ROLE_TREE: "tree";
  ROLE_TREEITEM: "treeitem";
  ROLE_NONE: "none";
  TABINDEX: "tabindex";
}>;
```

Defined in: [core/tokens/attrs/aria.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/attrs/aria.ts#L13)

Frozen aria attribute-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
