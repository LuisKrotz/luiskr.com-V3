[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/events/dom](../README.md) / WINDOW\_EVENTS

```ts
const WINDOW_EVENTS: Readonly<{
  SCROLL: 'scroll'
  SCROLLEND: 'scrollend'
  RESIZE: 'resize'
  POPSTATE: 'popstate'
  ERROR: 'error'
  UNHANDLED_REJECTION: 'unhandledrejection'
  LOAD: 'load'
  DOM_CONTENT_LOADED: 'DOMContentLoaded'
}>
```

Defined in: [src/core/tokens/events/dom.ts:101](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/events/dom.ts#L101)

Frozen window event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
