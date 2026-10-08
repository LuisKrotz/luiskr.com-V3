/**
 * @file legacy-polyfills/io.js
 * @description IntersectionObserver polyfill (W3C spec implementation) —
 * the site's lazy media, carousel autoplay and skeleton logic all gate on
 * viewport visibility. Native since Safari 12.1 / Chrome 51 — this file
 * only ships to engines older than that.
 */
/* istanbul ignore file */
import 'intersection-observer'
