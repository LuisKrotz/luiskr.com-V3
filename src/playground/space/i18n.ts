/**
 * @file space/i18n.ts
 * @description Locale handling for SpacePlayground — fetches the
 * earth-playground translation node per locale, stores labels, and merges
 * the CMS-published `defaults` map into the slider/checkbox definitions
 * (user-saved settings still win) plus live engine/input updates.
 */

import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'
import { LOCALES } from '@/core/tokens/locales.js'
import { TRANSLATION_KEYS } from '@/core/tokens/routes/translation-keys.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import store from '@/core/store.js'
import { fetchFirebaseDb } from '@/utils/data/db.js'
import {
  PARAM_HANDLERS,
  SLIDER_GROUPS,
  SP_DEF_BASELINE,
  SP_INPUT_TYPES,
  type SpParamValue,
} from './controls.js'
import type { SpacePlayground } from '../SpacePlayground.js'
import { devError } from '@/core/devlog.js'

/**
 * Loads space translations.
 * @param c — the component
 */
export function loadSpaceTranslations(c: SpacePlayground): void {
  const lang = store.getters.getlang()

  const currentLocale = lang?.locale || LOCALES.EN

  c._lastLocale = currentLocale

  const dbpath = `${lang.database}${currentLocale}${lang.pagesPath}${TRANSLATION_KEYS.EARTH_PLAYGROUND}`

  fetchFirebaseDb(dbpath)
    .then((snapshot) => {
      if (snapshot?.exists()) {
        c._applyTranslations(snapshot.val() as Record<string, unknown>)
      } else {
        const fallbackPath = `${lang.database}${LOCALES.EN}${lang.pagesPath}${TRANSLATION_KEYS.EARTH_PLAYGROUND}`

        fetchFirebaseDb(fallbackPath).then((fallbackSnap) => {
          if (fallbackSnap?.exists()) {
            c._applyTranslations(fallbackSnap.val() as Record<string, unknown>)
          }
        })
      }
    })
    .catch(devError)
}

/**
 * Applies space translations.
 */
export function applySpaceTranslations(
  c: SpacePlayground,
  val: Record<string, unknown> | null | undefined
): void {
  const { defaults, ...labels } = val || {}

  c.translations = labels

  c._applyDbDefaults(defaults as Record<string, SpParamValue> | undefined)
  c._updateDom()
}

/**
 * Applies space db defaults.
 */
export function applySpaceDbDefaults(
  c: SpacePlayground,
  defaults: Record<string, SpParamValue> | null | undefined
): void {
  const hasDefaults = defaults && typeof defaults === TYPE_STRINGS.OBJECT

  SLIDER_GROUPS.forEach((grp, gi) => {
    grp.controls.forEach((ctrl, ci) => {
      ctrl.def = SP_DEF_BASELINE[gi][ci].def
      ctrl.checked = SP_DEF_BASELINE[gi][ci].checked
    })
  })

  if (!hasDefaults) return

  for (const grp of SLIDER_GROUPS) {
    for (const ctrl of grp.controls) {
      const v = defaults[ctrl.label]

      if (v === undefined) continue
      if (ctrl.type === SP_INPUT_TYPES.CHECKBOX) ctrl.checked = Boolean(v)
      else ctrl.def = Number(v)

      const hasSaved =
        c._savedSettings && Object.prototype.hasOwnProperty.call(c._savedSettings, ctrl.param)

      if (hasSaved) continue

      const input = c.shadowRoot?.querySelector<HTMLInputElement>(
        `[${DATA_ATTRS.DATA_PARAM}="${ctrl.param}"]`
      )

      if (input) {
        if (ctrl.type === SP_INPUT_TYPES.CHECKBOX) input.checked = Boolean(ctrl.checked)
        else input.value = String(ctrl.def)
      }

      if (c._earthBg)
        PARAM_HANDLERS[ctrl.param]?.(
          c._earthBg,
          ctrl.type === SP_INPUT_TYPES.CHECKBOX ? Boolean(ctrl.checked) : Number(ctrl.def)
        )
    }
  }
}
