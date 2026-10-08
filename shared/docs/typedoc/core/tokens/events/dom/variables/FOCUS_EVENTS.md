[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/events/dom](../README.md) / FOCUS\_EVENTS

```ts
const FOCUS_EVENTS: Readonly<{
  FOCUS: "focus";
  BLUR: "blur";
  FOCUSIN: "focusin";
  FOCUSOUT: "focusout";
}>;
```

Defined in: [core/tokens/events/dom.ts:66](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/events/dom.ts#L66)

Frozen focus event-name map — `focusin`/`focusout` bubble (needed for
delegation on shadow hosts) while `focus`/`blur` do not; both pairs are
kept so listeners pick the right variant for the propagation model.
