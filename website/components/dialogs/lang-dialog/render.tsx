/**
 * @file lang-dialog/render.tsx — the dialog's JSX template.
 *
 * Each option shows up to two flag layers: the WebGL waving-flag canvas
 * (animated decorative layer) and a real <img> SVG flag (CSS fallback +
 * instant paint). Two-code locales (l.cc2, e.g. split-language flags)
 * render both halves at natural aspect ratio.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { FLAG_CLASSES } from '@core/tokens/classes/flags.js'
import { LANG_CLASSES } from '@core/tokens/classes/lang.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { DIALOG_IDS } from '@core/tokens/ids/dialogs.js'
import { ASSET_PATHS } from '@core/tokens/routes/paths.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { h } from '@core/jsx.js'
import store from '@core/store.js'
import { LANG_OPTIONS } from '@core/i18n.js'
import { componentText } from '@core/locale/ui-text.js'
import type { LangDialog } from '../LangDialog.js'
import { FLAG_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { LANG_COMPONENT_KEYS } from '@core/tokens/data/component-keys.js'

type LangOption = (typeof LANG_OPTIONS)[number]

/** One flag <img> — decorative twin of the WebGL canvas layer. */
function flagImg(l: LangOption, cc: string | undefined, alt: string, width: number) {
  return (
    <img
      className={FLAG_CLASSES.FLAG_IMG}
      src={`${ASSET_PATHS.FLAGS_PREFIX}${cc}${ASSET_PATHS.SVG_EXT}`}
      alt={alt}
      width={width}
      height={FLAG_DIMENSIONS.FLAG_DIALOG_HEIGHT}
      decoding={MEDIA_ATTRS.DECODING_ASYNC}
      loading={MEDIA_ATTRS.LOADING_LAZY}
    />
  )
}

/** One locale option button (flag layers + short/native labels). */
function renderLangOption(host: LangDialog, l: LangOption, currentLocale: string) {
  return (
    <button
      key={l.code}
      className={`${PREF_CLASSES.PREF_OPTION_BTN} ${currentLocale === l.code ? STATE_CLASSES.ACTIVE : ATTR_VALUES.EMPTY}`}
      data-lang={l.code}
      type={FORM_ATTRS.BUTTON}
      onClick={() => host.selectLang(l.code)}
    >
      <span className={PREF_CLASSES.PREF_OPTION_ICON} aria-hidden={ATTR_VALUES.TRUE}>
        <canvas className={FLAG_CLASSES.FLAG_CANVAS} data-flag={l.code} />
        {l.cc2 ? (
          <span className={FLAG_CLASSES.FLAG_SPLIT}>
            {flagImg(l, l.cc, l.label, FLAG_DIMENSIONS.FLAG_DIALOG_SPLIT_WIDTH)}
            {flagImg(l, l.cc2, ATTR_VALUES.EMPTY, FLAG_DIMENSIONS.FLAG_DIALOG_SPLIT_WIDTH)}
          </span>
        ) : (
          flagImg(l, l.cc, l.label, FLAG_DIMENSIONS.FLAG_DIALOG_WIDTH)
        )}
      </span>
      <span className={PREF_CLASSES.PREF_OPTION_LABEL}>{l.short}</span>
      <span className={PREF_CLASSES.PREF_OPTION_SUB}>{l.label}</span>
    </button>
  )
}

/** JSX template. */
export function renderLangDialog(host: LangDialog) {
  if (!host.isOpen) return null

  const currentLocale = store.getters.getLang()

  const compLang =
    (store.getters.getlang()?.components as Record<string, Record<string, string>> | undefined)?.[
      CMS_KEYS.LANG_DIALOG
    ] || {}

  const dialogTitle = compLang.title || (componentText(LANG_COMPONENT_KEYS.LANG_TITLE) as string)

  const closeLabel = compLang.close || (componentText(LANG_COMPONENT_KEYS.LANG_CLOSE) as string)

  return (
    <div
      className={PREF_CLASSES.PREF_BACKDROP}
      tabIndex={CHAR_STRINGS.MINUS_ONE}
      onClick={(e: MouseEvent) => {
        if (e.target === e.currentTarget) host.close()
      }}
    >
      <div
        className={`${PREF_CLASSES.PREF_DIALOG} ${LANG_CLASSES.LANG_DIALOG}`}
        role={ARIA_ATTRS.ROLE_DIALOG}
        aria-modal={ATTR_VALUES.TRUE}
        aria-labelledby={DIALOG_IDS.LANG_DIALOG_TITLE}
      >
        <header className={PREF_CLASSES.PREF_HEADER}>
          <h2 id={DIALOG_IDS.LANG_DIALOG_TITLE} className={PREF_CLASSES.PREF_TITLE}>
            {dialogTitle}
          </h2>
          <button
            className={PREF_CLASSES.PREF_CLOSE_BTN}
            aria-label={closeLabel}
            type={FORM_ATTRS.BUTTON}
            onClick={() => host.close()}
          >
            <canvas className={PREF_CLASSES.PREF_CLOSE_CANVAS} />
          </button>
        </header>

        <div className={PREF_CLASSES.PREF_BODY}>
          <div className={PREF_CLASSES.PREF_OPTIONS_4}>
            <div className={LANG_CLASSES.LANG_GLASS_FOLLOWER} aria-hidden={ATTR_VALUES.TRUE} />
            {LANG_OPTIONS.map((l) => renderLangOption(host, l, currentLocale))}
          </div>
        </div>
      </div>
    </div>
  )
}
