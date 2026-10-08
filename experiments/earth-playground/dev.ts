/* istanbul ignore file -- standalone dev entry; only runs under `vite dev`, never bundled or exercised by tests */
/**
 * @file experiments/earth-playground/dev.ts
 * @description Standalone dev entry for the earth-playground experiment —
 * `yarn dev` in this folder mounts <view-space-playground> directly so the
 * experiment iterates without the whole-site router or the root build.
 * Its public/ payloads (textures, music) are served by the shared
 * module-public plugin under the same /experiments/earth-playground/
 * URL prefix the production build uses.
 */
import '@core/store.js'
import './index.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'

/** Mounts the playground view element into the document body. */
const mount = (): void => {
  document.body.replaceChildren(document.createElement(VIEW_TAGS.VIEW_SPACE_PLAYGROUND))
}

if (document.readyState === 'loading') {
  document.addEventListener(WINDOW_EVENTS.DOM_CONTENT_LOADED, mount, { once: true })
} else {
  mount()
}
