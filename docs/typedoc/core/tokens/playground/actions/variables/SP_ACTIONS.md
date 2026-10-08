[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/playground/actions](../README.md) / SP\_ACTIONS

```ts
const SP_ACTIONS: Readonly<{
  RESET: 'reset'
  TOGGLE_ROTATE: 'toggle-rotate'
  PANEL_TOGGLE: 'panel-toggle'
  PANEL_OPEN: 'panel-open'
  SCREENSHOT: 'screenshot'
  COPY_CONSTANTS: 'copy-constants'
  TOGGLE_MUSIC: 'toggle-music'
}>
```

Defined in: [core/tokens/playground/actions.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/core/tokens/playground/actions.ts#L12)

Toolbar/panel action names dispatched by the playground UI. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
