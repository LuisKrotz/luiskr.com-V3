/**
 * @file safari/patches/media-figure.ts
 * @description MediaFigure patch orchestrator: safari-media styles,
 * lazy thumbnails, Q50-capped high-res loads (4096px WebKit decode
 * ceiling), force-muted autoplay videos with a first-touch unlock retry,
 * and the tap-vs-scroll expand gesture that bypasses iOS's unreliable
 * click synthesis. Implementation lives in media-figure/{video,
 * tap-expand,image-load}.ts.
 */

import { MEDIA_ATTRS } from '@/core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { EXPAND_MODAL_CLASSES } from '@/core/tokens/classes/modal.js'
import { INTERNAL_CLASSES } from '@/core/tokens/classes/project.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import type { PatchableCtor, SafariPatchableEl } from '../types.js'
import { safariLoadHighRes, bindSafariImageLoad } from './media-figure/image-load.js'
import { patchSafariVideo } from './media-figure/video.js'
import { bindSafariTapExpand } from './media-figure/tap-expand.js'
import safariMediaStyles from '@/sass/components/safari/safari-media.scss?inline'

/**
 * Installs the MediaFigure patch once the element registers:
 *  - `_renderInitial` is wrapped to inject the safari-media stylesheet
 *    into the shadow root after the base render.
 *  - `loadHighRes` is replaced by safariLoadHighRes (Q50-capped source so
 *    the decode stays under WebKit's ~4096px image ceiling).
 *  - `onMounted` is wrapped to clear the compositor hints Safari
 *    mishandles (will-change/transform/backface-visibility), patch video
 *    figures (muted autoplay + first-touch unlock retry), bind the
 *    tap-vs-scroll expand gesture on expandable figures, and bind the
 *    image load/error → isLoaded path for the shimmer handoff.
 */
export function patchMediaFigure(): void {
  // ── MediaFigure ────────────────────────────────────────────────────────────
  customElements.whenDefined(COMPONENT_TAGS.MEDIA_FIGURE).then(() => {
    const MediaFigureClass = customElements.get(COMPONENT_TAGS.MEDIA_FIGURE) as
      PatchableCtor | undefined

    if (!MediaFigureClass) return

    const originalMediaRenderInitial = MediaFigureClass.prototype._renderInitial

    MediaFigureClass.prototype._renderInitial = function (this: SafariPatchableEl) {
      originalMediaRenderInitial?.call(this)

      const safariStyle = document.createElement('style')

      safariStyle.textContent = safariMediaStyles

      this.shadowRoot?.appendChild(safariStyle)
    }

    MediaFigureClass.prototype.loadHighRes = function (this: SafariPatchableEl) {
      safariLoadHighRes(this)
    }

    const originalMediaOnMounted = MediaFigureClass.prototype.onMounted

    MediaFigureClass.prototype.onMounted = function (this: SafariPatchableEl) {
      originalMediaOnMounted?.call(this)

      this.style.willChange = ATTR_VALUES.EMPTY

      this.style.transform = ATTR_VALUES.EMPTY

      this.style.backfaceVisibility = ATTR_VALUES.EMPTY

      const isHero = Boolean(
        (this.classes && this.classes.includes(INTERNAL_CLASSES.INTERNAL_MAIN_ITEM)) ||
        this.classList.contains(INTERNAL_CLASSES.INTERNAL_MAIN_ITEM) ||
        this.hasAttribute(MEDIA_ATTRS.AUTO_PLAY) ||
        this.autoPlay
      )

      const fig = this.$(HTML_TAGS.FIGURE)

      const vid = this.$(HTML_TAGS.VIDEO) as HTMLVideoElement | null

      if (this.isVideo && vid) {
        patchSafariVideo(this, vid, fig, isHero)
      }

      if (this.canExpand) {
        const targets = [fig, this.$(`.${EXPAND_MODAL_CLASSES.EXPAND_MODAL_OPEN_1}`), vid].filter(
          (t): t is HTMLElement => Boolean(t)
        )

        bindSafariTapExpand(this, targets)
      }

      bindSafariImageLoad(this, fig, isHero)
    }
  })
}
