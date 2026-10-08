[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/elements/components](../README.md) / COMPONENT\_TAGS

```ts
const COMPONENT_TAGS: Readonly<{
  MEDIA_EXPANDED: "media-expanded";
  MEDIA_FIGURE: "media-figure";
  DRAW_TEXT: "draw-text";
  CUSTOM_CAROUSEL: "custom-carousel";
  AWARDS_CAROUSEL: "awards-carousel";
  HOME_MOSAIC: "home-mosaic";
  ABOUT_SECTION: "about-section";
  CONTACT_SECTION: "contact-section";
  AWARDS_MENTIONS: "awards-mentions";
  PORTFOLIO_RELATED: "portfolio-related";
  LEGAL_FOOTER: "legal-footer";
  PREFERENCES_MODAL: "preferences-modal";
  LANG_DIALOG: "lang-dialog";
  COOKIE_BANNER: "cookie-banner";
  SITE_TOAST: "site-toast";
  APP_NAV: "app-nav";
  APP_ROOT: "app-root";
  STATS_HUD: "stats-hud";
}>;
```

Defined in: [core/tokens/elements/components.ts:24](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/elements/components.ts#L24)

Frozen component element tag-name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
