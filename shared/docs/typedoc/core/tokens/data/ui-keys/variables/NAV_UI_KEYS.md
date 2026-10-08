[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/ui-keys](../README.md) / NAV\_UI\_KEYS

```ts
const NAV_UI_KEYS: Readonly<{
  SCROLL_UP: "scrollup";
  PREFERENCES: "preferences";
  LANGUAGE: "language";
  MENU: "menu";
  CLOSE: "close";
  SITE_PREFERENCES: "sitePreferences";
}>;
```

Defined in: [core/tokens/data/ui-keys.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/ui-keys.ts#L39)

Frozen nav ui key map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
