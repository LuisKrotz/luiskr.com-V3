[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/selectors/cookies](../README.md) / COOKIE\_SELECTORS

```ts
const COOKIE_SELECTORS: Readonly<{
  COOKIES: ".cookies";
  COOKIES_BUTTONS_ACCEPT: ".cookies-buttons-accept";
  COOKIES_BUTTONS_REFUSE: ".cookies-buttons-refuse";
}>;
```

Defined in: [core/tokens/selectors/cookies.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/selectors/cookies.ts#L13)

Frozen cookie selector map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
