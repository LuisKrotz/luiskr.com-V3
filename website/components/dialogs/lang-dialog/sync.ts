/**
 * @file lang-dialog/sync.ts — reflects the open flag into DOM/classes.
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import type { LangDialog } from '../LangDialog.js'
import { destroyWebGLControls } from './webgl.js'

/** Reflects the open flag into DOM state (classes, genie enter/leave). */
export function syncOpenState(host: LangDialog): void {
  if (host.isOpen) {
    host.setAttribute(COMMON_ATTRS.OPEN, ATTR_VALUES.EMPTY)

    host.classList.add(STATE_CLASSES.IS_OPEN)
  } else {
    host.removeAttribute(COMMON_ATTRS.OPEN)

    host.classList.remove(STATE_CLASSES.IS_OPEN)

    destroyWebGLControls(host)
  }
}
