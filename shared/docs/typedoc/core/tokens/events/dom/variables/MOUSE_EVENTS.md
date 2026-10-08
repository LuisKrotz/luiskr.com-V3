[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/events/dom](../README.md) / MOUSE\_EVENTS

```ts
const MOUSE_EVENTS: Readonly<{
  CLICK: "click";
  MOUSEENTER: "mouseenter";
  MOUSELEAVE: "mouseleave";
  MOUSEOVER: "mouseover";
  MOUSEOUT: "mouseout";
  MOUSEDOWN: "mousedown";
  MOUSEUP: "mouseup";
  WHEEL: "wheel";
  CONTEXTMENU: "contextmenu";
}>;
```

Defined in: [core/tokens/events/dom.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/events/dom.ts#L14)

Frozen mouse event-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
