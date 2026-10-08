/**
 * @file media/expanded-render.tsx
 * @description JSX template for <media-expanded> — four close affordances
 * for different user instincts: the labelled ✕ in the title bar, a
 * full-viewport click-catcher behind the figure, Escape (bound in
 * onMounted), and a bottom close button. The figure renders thumb-first
 * and swaps to the cached full blob via currentSrc (same layered pattern
 * as media-figure).
 */

import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { EXPAND_MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { h, Fragment } from '@core/jsx.js'
import store from '@core/store.js'
import { componentText } from '@core/locale/ui-text.js'
import type { MediaExpanded } from '../MediaExpanded.js'
import { MEDIA_COMPONENT_KEYS } from '@core/tokens/data/component-keys.js'

/**
 * Renders media expanded.
 * @param el — the element
 */
export function renderMediaExpanded(el: MediaExpanded) {
  const compMedia =
    (store.getters.getlang().components as { media?: { close?: string } } | undefined)?.media || {}

  const closeText = compMedia.close || componentText(MEDIA_COMPONENT_KEYS.MEDIA_CLOSE)

  const isReduced = store.getters.getReducedMotion()

  const mediaW = el.mediaWidth

  const mediaH = el.mediaHeight

  return (
    <div
      className={`${EXPAND_MODAL_CLASSES.EXPAND_MODAL_CONTENT} ${el.isClosing ? EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSING : ATTR_VALUES.EMPTY} ${el.isVideo ? EXPAND_MODAL_CLASSES.EXPAND_MODAL_CONTENT_VIDEO : ATTR_VALUES.EMPTY}`}
    >
      <div className={EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_BAR}>
        <span className={EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_BAR_TITLE}>{el.alt}</span>

        <button
          className={PREF_CLASSES.PREF_CLOSE_BTN}
          type={FORM_ATTRS.BUTTON}
          aria-label={closeText}
          onClick={() => el.startClose()}
        >
          <canvas className={`${PREF_CLASSES.PREF_CLOSE_CANVAS} ${STATE_CLASSES.IS_FALLBACK}`} />
          <span
            className={EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_BAR_FALLBACK}
            aria-hidden={ATTR_VALUES.TRUE}
          />
        </button>
      </div>
      <div className={EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_AREA} />
      <figure
        className={`${EXPAND_MODAL_CLASSES.EXPAND_MODAL_MEDIA_FIGURE} ${el.isVideo ? EXPAND_MODAL_CLASSES.EXPAND_MODAL_MEDIA_FIGURE_VIDEO : ATTR_VALUES.EMPTY}`}
      >
        {!el.isVideo ? (
          <Fragment>
            <img
              decoding={MEDIA_ATTRS.DECODING_ASYNC}
              className={EXPAND_MODAL_CLASSES.EXPAND_MODAL_MEDIA_PLACEHOLDER}
              src={el.placeholder(mediaW, mediaH)}
              width={mediaW}
              height={mediaH}
              alt={ATTR_VALUES.EMPTY}
              aria-hidden={ATTR_VALUES.TRUE}
              tabIndex={CHAR_STRINGS.MINUS_ONE}
              data-nosnippet
            />
            <img
              decoding={MEDIA_ATTRS.DECODING_ASYNC}
              className={EXPAND_MODAL_CLASSES.EXPAND_MODAL_MEDIA_ITEM}
              width={mediaW}
              height={mediaH}
              alt={el.alt}
              src={el.currentSrc || el.thumb}
            />
          </Fragment>
        ) : (
          <video
            decoding={MEDIA_ATTRS.DECODING_ASYNC}
            className={`${EXPAND_MODAL_CLASSES.EXPAND_MODAL_MEDIA_ITEM} ${EXPAND_MODAL_CLASSES.EXPAND_MODAL_MEDIA_ITEM_VIDEO}`}
            width={mediaW}
            height={mediaH}
            poster={el.thumb}
            alt={el.alt}
            playsInline
            autoPlay={!isReduced}
            loop
            muted
            controls
            controlsList={MEDIA_ATTRS.NO_DOWNLOAD}
            disablePictureInPicture
          >
            <source src={el.source} type={MEDIA_ATTRS.VIDEO_MP4} />
          </video>
        )}
      </figure>

      <button className={EXPAND_MODAL_CLASSES.EXPAND_MODAL_CLOSE_BOTTOM} type={FORM_ATTRS.BUTTON}>
        {closeText}
      </button>
    </div>
  )
}
