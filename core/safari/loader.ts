/**
 * @file safari-loader.js
 * @description Safari/iOS compatibility bundle entry — imports the
 * polyfills, the Safari compat SCSS, and the prototype patches.
 * Dynamically imported ONLY when feature detection in main.js determines
 * the browser needs it (`!CSS.supports('container-type','inline-size')`
 * or an Apple/GestureEvent signal). Vite code-splits this into its own
 * chunk at build time, so Chrome, Firefox, and Safari 16+ never download
 * or execute it — old-iOS users pay the compat cost alone.
 */
/* istanbul ignore file */
import '../legacy-polyfills/polyfills.js'
import '@core/sass/components/safari/safari-compat.scss'
import './patch.js'
