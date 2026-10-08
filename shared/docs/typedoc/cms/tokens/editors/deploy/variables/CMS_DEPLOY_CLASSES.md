[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/editors/deploy](../README.md) / CMS\_DEPLOY\_CLASSES

```ts
const CMS_DEPLOY_CLASSES: Readonly<{
  CMS_SCORE: "cms-score";
  CMS_SCORE_GOOD: "cms-score--good";
  CMS_SCORE_WARN: "cms-score--warn";
  CMS_SCORE_BAD: "cms-score--bad";
  CMS_DEPLOY_TABLE: "cms-deploy-table";
  CMS_DEPLOY_URL: "cms-deploy-url";
}>;
```

Defined in: [cms/tokens/editors/deploy.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/editors/deploy.ts#L13)

Frozen cms deploy class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
