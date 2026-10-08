[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/awards](../README.md) / AWARDS\_CLASSES

```ts
const AWARDS_CLASSES: Readonly<{
  AWARDS_FOOTER: "awards-footer";
  AWARDS_FOOTER_TITLE: "awards-footer-title";
  AWARDS_FOOTER_HEADER: "awards-footer-header";
  AWARDS_FOOTER_PROGRESS: "awards-footer-progress";
  AWARDS_FOOTER_PROGRESS_FILL: "awards-footer-progress-fill";
  AWARDS_FOOTER_PROGRESS_FILL_RUNNING: "awards-footer-progress-fill--running";
  AWARDS_FOOTER_PROGRESS_HIDDEN: "awards-footer-progress--hidden";
  AWARDS_FOOTER_LINKS: "awards-footer-links";
  AWARDS_FOOTER_ITEM: "awards-footer-links-item";
  AWARDS_FOOTER_SEP: "awards-footer-links-sep";
  AWARDS_FOOTER_SKEL: "awards-footer-skel";
}>;
```

Defined in: [core/tokens/classes/awards.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/awards.ts#L18)

Frozen awards class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
