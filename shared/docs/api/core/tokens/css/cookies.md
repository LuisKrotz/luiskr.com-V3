# `core/tokens/css/cookies.ts`

Cookie-banner CSS custom-property names — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/css/cookies.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `BANNER_H`

--cookie-banner-h — live pixel height of the consent banner while it
is visible; set/removed on documentElement by CookieBanner so `main`
gets matching bottom clearance on every route (custom props pierce
shadow boundaries). Removed entirely when the banner hides.
