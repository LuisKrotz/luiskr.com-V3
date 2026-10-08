[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/events/mutations](../README.md) / UI\_MUTATIONS

```ts
const UI_MUTATIONS: Readonly<{
  SET_CLICK_OR_TAP: "setClickOrTap";
  SET_INPUT_METHOD: "setInputMethod";
  SET_HOVER: "setHover";
  SET_CLEAR: "setClear";
  SET_MARQUEE_AMOUNT: "setMarqueeAmount";
  SET_ON_MOUSE_MOVE: "setOnMouseMove";
}>;
```

Defined in: [core/tokens/events/mutations.ts:68](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/events/mutations.ts#L68)

Frozen ui store-mutation name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
