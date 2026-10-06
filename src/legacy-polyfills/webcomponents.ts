/**
 * @file legacy-polyfills/webcomponents.js
 * @description Web Components suite (custom elements v1, Shadow DOM via
 * ShadyDOM, template, HTML Imports) for browsers that lack them — every
 * site component is a custom element, so this is mandatory on engines
 * without native support. Loaded only when customElements/attachShadow
 * are missing; browsers with native WC never fetch it.
 */
/* istanbul ignore file */
import '@webcomponents/webcomponentsjs'
