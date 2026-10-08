[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/ui-keys](../README.md) / AWARDS\_UI\_KEYS

```ts
const AWARDS_UI_KEYS: Readonly<{
  AWARDS_NEXT: "awards.nextAward";
  AWARDS_LEGAL_NAV: "awards.legalNav";
}>;
```

Defined in: [core/tokens/data/ui-keys.ts:139](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/ui-keys.ts#L139)

Frozen awards ui key map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
