[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/tokens/base](../README.md) / SECTIONS

```ts
const SECTIONS: Readonly<{
  HOME: "home";
  ABOUT: "about";
  CONTACT: "contact";
}>;
```

Defined in: [core/tokens/base.ts:502](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/base.ts#L502)

Frozen sections map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
