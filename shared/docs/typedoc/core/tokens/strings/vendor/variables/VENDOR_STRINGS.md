[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/vendor](../README.md) / VENDOR\_STRINGS

```ts
const VENDOR_STRINGS: Readonly<{
  APPLE_VENDOR: "Apple Computer, Inc.";
  GESTURE_EVENT: "GestureEvent";
  ANONYMOUS: "anonymous";
  OTHER: "other";
  WEBKIT_OVERFLOW_SCROLLING: "-webkit-overflow-scrolling";
  OVERFLOW_TOUCH: "touch";
}>;
```

Defined in: [core/tokens/strings/vendor.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/vendor.ts#L12)

Vendor fingerprint + platform string tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
