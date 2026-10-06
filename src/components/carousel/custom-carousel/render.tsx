/**
 * @file carousel-render.tsx
 * @description Pure JSX render helpers for <custom-carousel>, extracted
 * from CustomCarousel.tsx: one slide's media-figure content and the
 * prev/next arrow control button (direction-parameterized so a single
 * template serves both sides). No state — everything arrives as params.
 */

import { SVG_ATTRS } from '@/core/tokens/attrs/svg.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { CAROUSEL_CLASSES } from '@/core/tokens/classes/carousel.js'
import { INTERNAL_CLASSES } from '@/core/tokens/classes/project.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { ARROW_GLYPHS, ARROW_TYPES } from '@/core/tokens/theme/arrows.js'
import { h } from '@/core/jsx.js'
import store from '@/core/store.js'
import type { CustomCarousel } from '../CustomCarousel.js'

/** Slide descriptor consumed by the carousel. */
export interface CarouselItem {
  src: string
  size?: number[]
  label?: string
  class?: string
  isVideo?: boolean
  canExpand?: boolean
}

/** Localized carousel control labels (store.lang.carousel). */
export interface CarouselLang {
  prev: string
  next: string
  ofLabel: string
}

/**
 * One slide's inner content — a <media-figure> with the item's CDN src
 * (folder + src), intrinsic size for aspect-ratio layout, and the
 * expand/video/label flags. Returns null for placeholder entries.
 */
export const renderCarouselSlide = (item: CarouselItem | null, folder: string) => {
  if (!item) return null

  const src = folder + item.src

  const itemW = item.size ? item.size[0] : 800

  const itemH = item.size ? item.size[1] : 450

  const canExpand = item.canExpand ?? false

  const isVideo = item.isVideo ?? false

  const label = item.label || ATTR_VALUES.EMPTY

  const itemClass = item.class || ATTR_VALUES.EMPTY

  const MediaFigure = COMPONENT_TAGS.MEDIA_FIGURE

  return (
    <div className={`${INTERNAL_CLASSES.INTERNAL_EXTRA_ITEM} ${itemClass}`}>
      <MediaFigure
        src={src}
        width={itemW}
        height={itemH}
        can-expand={canExpand}
        is-video={isVideo}
        label={label}
        classes={itemClass}
        class={itemClass}
      />
    </div>
  )
}

/**
 * One prev/next control button: a WebGL arrow canvas behind an SVG
 * autoplay progress ring (stroke-dashoffset driven by the carousel's
 * _updateRingDom) plus a text glyph fallback. `direction` selects the
 * modifier class, aria-label and glyph (ARROW_TYPES.PREV/NEXT).
 */
export const renderArrowButton = (direction: string, lang: CarouselLang, circumference: number) => {
  const isPrev = direction === ARROW_TYPES.PREV

  const btnClass = isPrev ? CAROUSEL_CLASSES.CAROUSEL_BTN_PREV : CAROUSEL_CLASSES.CAROUSEL_BTN_NEXT

  const glyph = isPrev ? ARROW_GLYPHS.PREV : ARROW_GLYPHS.NEXT

  return (
    <button
      className={btnClass}
      aria-label={isPrev ? lang.prev : lang.next}
      type={FORM_ATTRS.BUTTON}
    >
      <canvas className={CAROUSEL_CLASSES.CAROUSEL_BTN_CANVAS} />

      <svg
        className={CAROUSEL_CLASSES.CAROUSEL_BTN_RING}
        viewBox={SVG_ATTRS.RING_VIEWBOX}
        aria-hidden={ATTR_VALUES.TRUE}
      >
        <circle
          className={CAROUSEL_CLASSES.CAROUSEL_BTN_RING_TRACK}
          cx={SVG_ATTRS.RING_CX}
          cy={SVG_ATTRS.RING_CY}
          r={SVG_ATTRS.RING_R}
        />

        <circle
          className={CAROUSEL_CLASSES.CAROUSEL_BTN_RING_FILL}
          cx={SVG_ATTRS.RING_CX}
          cy={SVG_ATTRS.RING_CY}
          r={SVG_ATTRS.RING_R}
          style={{
            strokeDasharray: `${circumference}`,
            strokeDashoffset: `${circumference}`,
          }}
        />
      </svg>

      <span className={CAROUSEL_CLASSES.CAROUSEL_BTN_ARROW} aria-hidden={ATTR_VALUES.TRUE}>
        {glyph}
      </span>
    </button>
  )
}

/** Dot-navigation strip: counter + one button per real slide. */
const renderDots = (host: CustomCarousel, lang: CarouselLang) => (
  <div className={CAROUSEL_CLASSES.CAROUSEL_INDICATORS}>
    <span className={CAROUSEL_CLASSES.CAROUSEL_COUNTER}>
      {host.currentIndex + 1} {lang.ofLabel} {host.items.length}
    </span>

    <div className={CAROUSEL_CLASSES.CAROUSEL_DOTS}>
      {host.items.map((_, idx) => (
        <button
          key={idx}
          className={`${CAROUSEL_CLASSES.CAROUSEL_DOT} ${host.currentIndex === idx ? CAROUSEL_CLASSES.CAROUSEL_DOT_ACTIVE : ATTR_VALUES.EMPTY}`}
          aria-label={`${idx + 1} ${lang.ofLabel} ${host.items.length}`}
          type={FORM_ATTRS.BUTTON}
        />
      ))}
    </div>
  </div>
)

/**
 * JSX template. Two shapes:
 *   inactive (≤1 item, or items fit side-by-side) → a plain flex row,
 *     no track/controls — media is already fully visible
 *   active → track = [clone-last][items…][clone-first] + controls.
 *     Clones are aria-hidden + inert — screen readers and tab order see
 *     only the real slides; the teleport logic uses them for the wrap.
 * Each control button carries an SVG progress ring (dashoffset driven
 * by _updateRingDom) behind a WebGL arrow canvas.
 */
export const renderCarousel = (host: CustomCarousel) => {
  if (!host.isActive) {
    const fallbackClass = host._isSideBySide
      ? CAROUSEL_CLASSES.CAROUSEL_FALLBACK_SIDE
      : CAROUSEL_CLASSES.CAROUSEL_FALLBACK

    return <div className={fallbackClass}>{host.items.map((item) => host.renderSlide(item))}</div>
  }

  const lastItem = host.items[host.items.length - 1]

  const firstItem = host.items[0]

  const lang = store.getters.getCarouselLang() as unknown as CarouselLang

  return (
    <div
      className={`${CAROUSEL_CLASSES.CAROUSEL} ${host.isEnteredViewport ? CAROUSEL_CLASSES.CAROUSEL_IN_VIEW : ATTR_VALUES.EMPTY}`}
    >
      <div className={CAROUSEL_CLASSES.CAROUSEL_TRACK}>
        <div
          className={`${CAROUSEL_CLASSES.CAROUSEL_SLIDE} ${CAROUSEL_CLASSES.CAROUSEL_SLIDE_CLONE_LAST}`}
          aria-hidden={ATTR_VALUES.TRUE}
          inert
        >
          {host.renderSlide(lastItem)}
        </div>

        {host.items.map((item, idx) => (
          <div
            key={idx}
            className={`${CAROUSEL_CLASSES.CAROUSEL_SLIDE} ${host.currentIndex === idx ? CAROUSEL_CLASSES.CAROUSEL_SLIDE_ACTIVE : ATTR_VALUES.EMPTY}`}
            role="group"
            aria-label={`${idx + 1} of ${host.items.length}`}
          >
            {host.renderSlide(item)}
          </div>
        ))}

        <div
          className={`${CAROUSEL_CLASSES.CAROUSEL_SLIDE} ${CAROUSEL_CLASSES.CAROUSEL_SLIDE_CLONE_FIRST}`}
          aria-hidden={ATTR_VALUES.TRUE}
          inert
        >
          {host.renderSlide(firstItem)}
        </div>
      </div>

      <div className={CAROUSEL_CLASSES.CAROUSEL_CONTROLS}>
        {renderArrowButton(ARROW_TYPES.PREV, lang, host.circumference)}

        {renderDots(host, lang)}

        {renderArrowButton(ARROW_TYPES.NEXT, lang, host.circumference)}
      </div>
    </div>
  )
}
