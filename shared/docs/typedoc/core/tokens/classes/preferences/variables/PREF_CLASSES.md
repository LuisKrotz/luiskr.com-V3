[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/preferences](../README.md) / PREF\_CLASSES

```ts
const PREF_CLASSES: Readonly<{
  PREF_BACKDROP: "pref-backdrop";
  PREF_BACKDROP_ENTER: "pref-backdrop--enter";
  PREF_BACKDROP_LEAVE: "pref-backdrop--leave";
  PREF_DIALOG: "pref-dialog";
  PREF_HEADER: "pref-header";
  PREF_TITLE: "pref-title";
  PREF_CLOSE_BTN: "pref-close-btn";
  PREF_CLOSE_CANVAS: "pref-close-canvas";
  PREF_BODY: "pref-body";
  PREF_SECTION: "pref-section";
  PREF_SECTION_TITLE: "pref-section-title";
  PREF_SECTION_DESC: "pref-section-desc";
  PREF_OPTIONS: "pref-options";
  PREF_OPTIONS_2: "pref-options pref-options--2";
  PREF_OPTIONS_3: "pref-options pref-options--3";
  PREF_OPTIONS_4: "pref-options pref-options--4";
  PREF_OPTION_BTN: "pref-option-btn";
  PREF_OPTION_ICON: "pref-option-icon";
  PREF_OPTION_LABEL: "pref-option-label";
  PREF_OPTION_SUB: "pref-option-sub";
  PREF_STAT_CARD: "pref-stat-card";
  PREF_FOOTER: "pref-footer";
  PREF_DONE_BTN: "pref-done-btn";
  PREF_SWITCH_ROW: "pref-switch-row";
  PREF_SWITCH_INFO: "pref-switch-info";
  PREF_SWITCH_LABEL: "pref-switch-label";
  PREF_SWITCH_DESC: "pref-switch-desc";
  PREF_SWITCH: "pref-switch";
  PREF_SWITCH_ON: "pref-switch pref-switch--on";
  PREF_SWITCH_CANVAS: "pref-switch-canvas";
  PREF_THEME_WRAPPER: "pref-theme-wrapper";
  PREF_THEME_SLIDER: "pref-theme-slider";
  PREF_THEME_CANVAS: "pref-theme-canvas";
  PREF_THEME_LABELS: "pref-theme-labels";
  PREF_THEME_BTN: "pref-theme-btn";
  PREF_THEME_BTN_ACTIVE: "pref-theme-btn--active";
}>;
```

Defined in: [core/tokens/classes/preferences.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/preferences.ts#L24)

Frozen pref class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
