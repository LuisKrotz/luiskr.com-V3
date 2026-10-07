/**
 * @file tokens/css/cookies.ts
 * @description Cookie-banner CSS custom-property names — grouped subset of
 * CSS_PROPS.
 */

/**
 * Cookie-banner CSS custom-property names. Sole declaration site — consumers import members
 * from this frozen map rather than re-declaring the literals
 * (zero-hardcoding rule).
 */
export const COOKIE_CSS_PROPS = Object.freeze({
  /**
   * --cookie-banner-h — live pixel height of the consent banner while it
   * is visible; set/removed on documentElement by CookieBanner so `main`
   * gets matching bottom clearance on every route (custom props pierce
   * shadow boundaries). Removed entirely when the banner hides.
   */
  BANNER_H: '--cookie-banner-h',
})
