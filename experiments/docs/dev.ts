/* istanbul ignore file -- standalone dev entry; only runs under `vite dev`, never bundled or exercised by tests */
/**
 * @file experiments/docs/dev.ts
 * @description Standalone dev entry for the docs-portal experiment —
 * `yarn dev` in this folder mounts <view-docs> directly. The module vite
 * config wires the shared docs-portal plugin, so `virtual:docs-manifest`
 * and /docs-content/*.json payloads resolve exactly like the root build.
 */
import '@core/store.js'
import './index.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'

/** Mounts the docs portal view element into the document body. */
const mount = (): void => {
  document.body.replaceChildren(document.createElement(VIEW_TAGS.VIEW_DOCS))
}

if (document.readyState === 'loading') {
  document.addEventListener(WINDOW_EVENTS.DOM_CONTENT_LOADED, mount, { once: true })
} else {
  mount()
}
