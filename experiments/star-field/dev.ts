/* istanbul ignore file -- standalone dev entry; only runs under `vite dev`, never bundled or exercised by tests */
/**
 * @file experiments/star-field/dev.ts
 * @description Standalone dev entry for the star-field experiment —
 * `yarn dev` in this folder mounts <view-star-field> directly so the
 * experiment iterates without the whole-site router or the root build.
 * Its public/ payloads (textures, data JSONs) are served by the shared
 * module-public plugin under the same /experiments/star-field/ URL
 * prefix the production build uses.
 */
import '@core/store.js'
import './index.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'

/** Mounts the star-field view element into the document body. */
const mount = (): void => {
  document.body.replaceChildren(document.createElement(VIEW_TAGS.VIEW_STAR_FIELD))
}

if (document.readyState === 'loading') {
  document.addEventListener(WINDOW_EVENTS.DOM_CONTENT_LOADED, mount, { once: true })
} else {
  mount()
}
