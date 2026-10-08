/**
 * @file safari/patches/carousel.ts
 * @description CustomCarousel patch: injects the safari-carousel stylesheet into the
 * shadow root after first render and neuters _measureFit (iOS layout
 * thrash during fit measurement).
 */

import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import type { PatchableCtor, SafariPatchableEl } from '../types.js'
import safariCarouselStyles from '@core/sass/components/safari/safari-carousel.scss?inline'

/**
 * Installs the carousel patch once <custom-carousel> registers: neuters
 * `_measureFit` (iOS layout thrash — reading fit metrics mid-layout
 * forces synchronous reflow on every slide) and wraps `_renderInitial`
 * to inject the safari-carousel stylesheet into the shadow root.
 */
export function patchCarousel(): void {
  // ── CustomCarousel ─────────────────────────────────────────────────────────
  customElements.whenDefined(COMPONENT_TAGS.CUSTOM_CAROUSEL).then(() => {
    const CustomCarouselClass = customElements.get(COMPONENT_TAGS.CUSTOM_CAROUSEL) as
      PatchableCtor | undefined

    if (!CustomCarouselClass) return

    CustomCarouselClass.prototype._measureFit = () => {}

    const originalRenderInitial = CustomCarouselClass.prototype._renderInitial

    CustomCarouselClass.prototype._renderInitial = function (this: SafariPatchableEl) {
      originalRenderInitial?.call(this)

      const safariStyle = document.createElement('style')

      safariStyle.textContent = safariCarouselStyles

      this.shadowRoot?.appendChild(safariStyle)
    }
  })
}
