import { TAGS, CLASSES } from './core/constants.js'
import safariCarouselStyles from './sass/safari-carousel.scss?inline'
import safariMediaStyles from './sass/safari-media.scss?inline'

if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.classList.add(CLASSES.IS_SAFARI)
}

if (typeof customElements !== 'undefined') {
  customElements.whenDefined(TAGS.CUSTOM_CAROUSEL).then(() => {
    const CustomCarouselClass = customElements.get(TAGS.CUSTOM_CAROUSEL)

    if (!CustomCarouselClass || !CustomCarouselClass.prototype) return

    CustomCarouselClass.prototype._measureFit = function () {
      // Disabled on Safari to prevent false-positive side-by-side collapse
    }

    const originalRenderInitial = CustomCarouselClass.prototype._renderInitial

    CustomCarouselClass.prototype._renderInitial = function () {
      originalRenderInitial.call(this)

      const safariStyle = document.createElement('style')

      safariStyle.textContent = safariCarouselStyles

      this.shadowRoot.appendChild(safariStyle)
    }
  })

  customElements.whenDefined(TAGS.MEDIA_FIGURE).then(() => {
    const MediaFigureClass = customElements.get(TAGS.MEDIA_FIGURE)

    if (!MediaFigureClass || !MediaFigureClass.prototype) return

    const originalMediaRenderInitial = MediaFigureClass.prototype._renderInitial

    MediaFigureClass.prototype._renderInitial = function () {
      originalMediaRenderInitial.call(this)

      const safariStyle = document.createElement('style')

      safariStyle.textContent = safariMediaStyles

      this.shadowRoot.appendChild(safariStyle)
    }
  })
}
