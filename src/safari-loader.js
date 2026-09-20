/**
 * safari-loader.js
 *
 * Imports the Safari/iOS compatibility CSS.
 * This module is dynamically imported ONLY when feature detection in
 * main.js determines the browser needs it:
 *
 *   !CSS.supports('container-type', 'inline-size')
 *
 * Vite code-splits this into its own CSS chunk at build time.
 * Chrome, Firefox, and Safari 16+ never request this chunk.
 */
import './sass/safari-compat.scss'
import './safari-patch.js'
