[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/playground](../README.md) / SP\_CLASSES

```ts
const SP_CLASSES: Readonly<{
  SP_LOADER: "sp-loader";
  SP_LOADER_GLOW: "sp-loader-glow";
  SP_LOADER_GRID: "sp-loader-grid";
  SP_LOADER_CONTENT: "sp-loader-content";
  SP_LOADER_SPINNER_OUTER: "sp-loader-spinner-outer";
  SP_LOADER_SPINNER_INNER: "sp-loader-spinner-inner";
  SP_LOADER_COUNTER: "sp-loader-counter";
  SP_LOADER_PERCENT: "sp-loader-percent";
  SP_LOADER_VAL: "sp-loader-val";
  SP_LOADER_SYM: "sp-loader-sym";
  SP_LOADER_TITLE: "sp-loader-title";
  SP_LOADER_MSG: "sp-loader-msg";
  SP_LOADER_BAR: "sp-loader-bar";
  SP_LOADER_BAR_FILL: "sp-loader-bar-fill";
  SP_CONTROLS_WRAP: "sp-controls-wrap";
  SP_REOPEN: "sp-reopen";
  SP_PANEL: "sp-panel";
  SP_PANEL_HEADER: "sp-panel-header";
  SP_PANEL_TITLE: "sp-panel-title";
  SP_PANEL_TOGGLE: "sp-panel-toggle";
  SP_PANEL_BODY: "sp-panel-body";
  SP_PANEL_COLLAPSED: "sp-panel--collapsed";
  SP_CANVAS: "sp-canvas";
  SP_GROUP: "sp-panel-group";
  SP_GROUP_COLLAPSED: "sp-panel-group--collapsed";
  SP_GROUP_HEADER: "sp-panel-group-header";
  SP_GROUP_CHEVRON: "sp-panel-group-chevron";
  SP_GROUP_LABEL: "sp-panel-group-label";
  SP_GROUP_CONTENT: "sp-panel-group-content";
  SP_READOUT: "sp-panel-readout";
  SP_POS: "sp-panel-pos";
  SP_TGT: "sp-panel-tgt";
  SP_ROW: "sp-panel-row";
  SP_ROW_CHECK: "sp-panel-row--check";
  SP_ROW_LABEL: "sp-panel-row-label";
  SP_ROW_CTRL: "sp-panel-row-ctrl";
  SP_RANGE: "sp-panel-range";
  SP_RANGE_WRAPPER: "sp-panel-range-wrapper";
  SP_RANGE_CANVAS: "sp-panel-range-canvas";
  SP_CHECK_WRAPPER: "sp-panel-check-wrapper";
  SP_CHECK_CANVAS: "sp-panel-check-canvas";
  SP_CHECK_BOX: "sp-panel-check-box";
  SP_CHECK_INPUT: "sp-panel-check-input";
  SP_CHECK_ICON: "sp-panel-check-icon";
  SP_ACTION_WRAP: "sp-panel-action-wrap";
  SP_BTN: "sp-panel-btn";
  SP_SWITCH: "sp-panel-switch";
  SP_SWITCH_TRACK: "sp-panel-switch-track";
  SP_VAL: "sp-panel-val";
  SP_MUSIC: "sp-music";
  SP_AUDIO: "sp-audio";
}>;
```

Defined in: [core/tokens/classes/playground.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/playground.ts#L14)

Frozen sp class-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
