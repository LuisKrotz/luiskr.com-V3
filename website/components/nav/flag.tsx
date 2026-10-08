/**
 * @file nav-flag.tsx
 * @description Locale flag rendering + FlagWebGL lifecycle for <app-nav>,
 * extracted from AppNav.tsx: the persistent per-locale flag canvas, the
 * flag/split-flag JSX fallback, and the widget mount/teardown pair. The
 * canvas element survives re-renders so the GL context is created once
 * per language, not per render.
 */

import { FLAG_CLASSES } from '@core/tokens/classes/flags.js'
import { NAV_CLASSES } from '@core/tokens/classes/nav.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { ASSET_PATHS } from '@core/tokens/routes/paths.js'
import { SVG_STRINGS } from '@core/tokens/strings/svg.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { h } from '@core/jsx.js'
import { FlagWebGL } from '@core/utils/canvas/widgets/flag-webgl.js'
import type { LangOption } from '@core/i18n.js'
import { FLAG_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/** Host surface the flag helpers need (satisfied by AppNav). */
export interface NavFlagHost {
  /** Live flag widgets (max one — the menu flag). */
  _navFlags: FlagWebGL[]
  /** Persistent per-locale flag canvas; rebuilt on locale change. */
  _menuFlagCanvasEl: HTMLCanvasElement | null
  /** Locale the current flag canvas was built for. */
  _menuFlagLang: string | null
  /** Active locale code. */
  readonly locale: string
  /** The active LANG_OPTIONS entry (code + label + flag cc). */
  readonly currentLang: LangOption | null
}

/**
 * Returns the persistent flag canvas for the current locale, rebuilding
 * it only when the locale changed — a new canvas means a new GL context,
 * so the old widget is destroyed first to keep total contexts bounded.
 * @param host AppNav instance.
 * @returns The per-locale canvas element.
 */
export const navFlagCanvas = (host: NavFlagHost): HTMLCanvasElement => {
  if (!host._menuFlagCanvasEl || host._menuFlagLang !== host.locale) {
    destroyNavFlag(host)

    host._menuFlagCanvasEl = (
      <canvas className={`${FLAG_CLASSES.FLAG_CANVAS} ${FLAG_CLASSES.FLAG_CANVAS_NAV}`} />
    ) as HTMLCanvasElement

    host._menuFlagLang = host.locale
  }

  return host._menuFlagCanvasEl
}

/** Flag button content: GL canvas + <img> fallback (split flag for dual-cc locales). */
export const renderNavLocaleFlag = (host: NavFlagHost) => {
  const lang = host.currentLang

  if (!lang) return host.locale.toUpperCase()

  return (
    <span className={NAV_CLASSES.NAV_FLAG_WRAPPER}>
      {navFlagCanvas(host)}
      {lang.cc2 ? (
        <span className={FLAG_CLASSES.FLAG_SPLIT}>
          <img
            className={FLAG_CLASSES.FLAG_IMG}
            src={`${ASSET_PATHS.FLAGS_PREFIX}${lang.cc}${SVG_STRINGS.SVG_EXT}`}
            alt={lang.label}
            height={FLAG_DIMENSIONS.FLAG_NAV_HEIGHT}
            decoding={MEDIA_ATTRS.DECODING_ASYNC}
            loading={MEDIA_ATTRS.LOADING_LAZY}
          />
          <img
            className={FLAG_CLASSES.FLAG_IMG}
            src={`${ASSET_PATHS.FLAGS_PREFIX}${lang.cc2}${SVG_STRINGS.SVG_EXT}`}
            alt={ATTR_VALUES.EMPTY}
            height={FLAG_DIMENSIONS.FLAG_NAV_HEIGHT}
            decoding={MEDIA_ATTRS.DECODING_ASYNC}
            loading={MEDIA_ATTRS.LOADING_LAZY}
          />
        </span>
      ) : (
        <img
          className={FLAG_CLASSES.FLAG_IMG}
          src={`${ASSET_PATHS.FLAGS_PREFIX}${lang.cc}${SVG_STRINGS.SVG_EXT}`}
          alt={lang.label}
          height={FLAG_DIMENSIONS.FLAG_NAV_HEIGHT}
          decoding={MEDIA_ATTRS.DECODING_ASYNC}
          loading={MEDIA_ATTRS.LOADING_LAZY}
        />
      )}
    </span>
  )
}

/** Creates the FlagWebGL instance on the flag button's canvas. */
export const mountNavFlag = (host: NavFlagHost): void => {
  if (typeof window === TYPE_STRINGS.UNDEFINED) return

  const canvas = host._menuFlagCanvasEl

  // The flag only lives inside the menu; nothing to do while it is closed.
  if (!canvas || !canvas.isConnected) return

  const currentLang = host.currentLang

  // Dedup by canvas identity — mount is called after every re-render, but
  // a live widget on the same canvas must never be re-created (it would
  // leak a second GL context onto the same element).
  if (currentLang && !host._navFlags.some((f) => f.canvas === canvas)) {
    host._navFlags.push(new FlagWebGL(canvas, currentLang))
  }
}

/** Tears down the FlagWebGL instance. */
export const destroyNavFlag = (host: NavFlagHost): void => {
  host._navFlags.forEach((f) => f.destroy())

  host._navFlags = []

  host._menuFlagCanvasEl = null

  host._menuFlagLang = null
}
