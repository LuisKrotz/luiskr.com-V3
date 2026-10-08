/**
 * @file media/media-render.tsx
 * @description JSX for MediaFigure — layered placeholder/thumb/high-res crossfade stack (or the muted looping video path) plus the expand affordance buttons.
 */

import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { EXPAND_MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { MEDIA_CLASSES } from '@core/tokens/classes/media.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { h, Fragment } from '@core/jsx.js'
import { componentText } from '@core/locale/ui-text.js'
import store from '@core/store.js'
import type { MediaFigure } from '../MediaFigure.js'
import { MEDIA_COMPONENT_KEYS } from '@core/tokens/data/component-keys.js'

/**
 * Renders media figure.
 * @param c — the component
 */
export function renderMediaFigure(c: MediaFigure) {
  const mediaW = c.displayWidth

  const mediaH = c.displayHeight

  const action = store.getters.getClickOrTap()

  const compLang =
    (store.getters.getlang().components as Record<string, Record<string, string>> | undefined)
      ?.media || {}

  const toOpen = compLang.toOpen || (componentText(MEDIA_COMPONENT_KEYS.MEDIA_TO_OPEN) as string)

  const isHeroItem = c.classes.includes(INTERNAL_CLASSES.INTERNAL_MAIN_ITEM)

  const shouldPreloadVideo = c.autoPlay || isHeroItem

  return (
    <figure
      className={c.canExpand ? INTERNAL_CLASSES.INTERNAL_EXPAND : ATTR_VALUES.EMPTY}
      title={c.label}
    >
      <img
        decoding={MEDIA_ATTRS.DECODING_ASYNC}
        className={MEDIA_CLASSES.RENDER_PLACEHOLDER}
        src={c.placeholder(mediaW, mediaH)}
        width={mediaW}
        height={mediaH}
        alt={ATTR_VALUES.EMPTY}
        aria-hidden={ATTR_VALUES.TRUE}
      />

      {!c.isVideo ? (
        <Fragment>
          <img
            decoding={MEDIA_ATTRS.DECODING_ASYNC}
            loading={isHeroItem ? MEDIA_ATTRS.LOADING_EAGER : MEDIA_ATTRS.LOADING_LAZY}
            fetchpriority={
              isHeroItem ? MEDIA_ATTRS.FETCH_PRIORITY_HIGH : MEDIA_ATTRS.FETCH_PRIORITY_LOW
            }
            className={`${MEDIA_CLASSES.RENDER_MEDIA} ${MEDIA_CLASSES.RENDER_MEDIA_THUMB} ${c.classes}`}
            width={mediaW}
            height={mediaH}
            alt={c.label}
            src={c.thumbSrc}
          />

          <img
            decoding={MEDIA_ATTRS.DECODING_ASYNC}
            className={`${MEDIA_CLASSES.RENDER_MEDIA} ${MEDIA_CLASSES.RENDER_MEDIA_HIGH} ${c.classes} ${c.isLoaded ? MEDIA_CLASSES.RENDER_MEDIA_LOADED : ATTR_VALUES.EMPTY}`}
            width={mediaW}
            height={mediaH}
            alt={c.label}
            src={c.highResSrc || ATTR_VALUES.EMPTY}
          />
        </Fragment>
      ) : (
        <video
          className={`${MEDIA_CLASSES.RENDER_MEDIA} ${c.classes}`}
          poster={c.poster[0] || ATTR_VALUES.EMPTY}
          width={mediaW}
          height={mediaH}
          preload={shouldPreloadVideo ? MEDIA_ATTRS.METADATA : ATTR_VALUES.NONE}
          fetchpriority={isHeroItem ? MEDIA_ATTRS.FETCH_PRIORITY_HIGH : undefined}
          playsInline
          loop
          muted
          controlsList={MEDIA_ATTRS.NO_DOWNLOAD}
          disablePictureInPicture
          autoPlay={c.autoPlay}
          controls={store.getters.getReducedMotion()}
        >
          <track kind={MEDIA_ATTRS.CAPTIONS} />

          <source src={c.videoSrcMain} type={MEDIA_ATTRS.VIDEO_MP4} />

          {c.videoSrcFallback ? (
            <source src={c.videoSrcFallback} type={MEDIA_ATTRS.VIDEO_MP4} />
          ) : null}
        </video>
      )}

      {c.canExpand && (
        <Fragment>
          <button
            className={EXPAND_MODAL_CLASSES.EXPAND_MODAL_OPEN_1}
            data-no-snippet
            type={FORM_ATTRS.BUTTON}
          >
            {action} {toOpen}
          </button>

          <button
            className={EXPAND_MODAL_CLASSES.EXPAND_MODAL_OPEN_2}
            aria-label={`${action} ${toOpen}`}
            aria-hidden={ATTR_VALUES.TRUE}
            tabIndex={-1}
            data-no-snippet
            type={FORM_ATTRS.BUTTON}
          />
        </Fragment>
      )}
    </figure>
  )
}
