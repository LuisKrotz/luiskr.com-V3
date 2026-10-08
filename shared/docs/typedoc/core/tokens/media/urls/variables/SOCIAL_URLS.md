[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/media/urls](../README.md) / SOCIAL\_URLS

```ts
const SOCIAL_URLS: Readonly<{
  SITE: "https://luiskr.com";
  GITHUB: "https://github.com/LuisKrotz";
  GITHUB_REPO: "https://github.com/LuisKrotz/luiskr.com-V3";
  LINKEDIN: "https://www.linkedin.com/in/luis-kr%C3%B6tz/?locale=en_US";
}>;
```

Defined in: [core/tokens/media/urls.ts:25](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/media/urls.ts#L25)

Frozen social URL map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
