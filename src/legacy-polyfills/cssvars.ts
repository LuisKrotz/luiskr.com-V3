/**
 * @file legacy-polyfills/cssvars.js
 * @description CSS custom-properties ponyfill for IE11 / old EdgeHTML —
 * the entire design system is var()-driven, so engines without native
 * custom-property support need this to render any themed surface.
 * `onlyLegacy: true` makes it a no-op on engines that already support
 * var(); `watch` re-processes the shadow-root <style> injections the
 * component layer adds after boot.
 */
import cssVars from 'css-vars-ponyfill'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'

if (typeof window !== TYPE_STRINGS.UNDEFINED) {
  cssVars({
    watch: true,
    onlyLegacy: true,
    preserveStatic: false,
    include: 'style,link[rel="stylesheet"]',
  })
}
