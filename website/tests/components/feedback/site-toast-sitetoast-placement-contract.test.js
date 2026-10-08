/**
 * @file site-toast-sitetoast-placement-contract.test.js
 * @description Split from site-toast.test.js — covers the "SiteToast placement contract" describe.
 */
import fs from 'fs'
import { fileURLToPath } from 'url'
import { describe, test, expect, jest } from '@jest/globals'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { TOAST_CLASSES } from '@core/tokens/classes/toast.js'

const _flush = () => new Promise((resolve) => setTimeout(resolve, 0))

/** Fresh notify module (fresh _seen/_toastEl/_globalBound state) per call. */
const _loadNotify = async () => {
  jest.resetModules()

  return import('@core/utils/notify.js')
}

/** Mounts a toast element, returning it. */
const _mountToast = () => {
  const el = document.createElement(COMPONENT_TAGS.SITE_TOAST)

  document.body.appendChild(el)

  return el
}

const _items = (el) =>
  Array.from(el.shadowRoot.querySelectorAll(`.${TOAST_CLASSES.SITE_TOAST_ITEM}`))

// ─── Placement contract ─────────────────────────────────────────────────────
// The toast stack is anchored bottom-right on desktop and enters from the
// lower-right. Mobile intentionally spans edge-to-edge — that block is the
// only place `left:` may appear.

// ─── Placement contract ─────────────────────────────────────────────────────
// The toast stack is anchored bottom-right on desktop and enters from the
// lower-right. Mobile intentionally spans edge-to-edge — that block is the
// only place `left:` may appear.
describe('SiteToast placement contract', () => {
  const scssPath = fileURLToPath(
    new URL('../../../../core/sass/components/feedback/site-toast.scss', import.meta.url)
  )
  const scss = fs.readFileSync(scssPath, 'utf-8')

  // Everything before the first `@media` is desktop-first source.
  const desktop = scss.slice(0, scss.indexOf('@media'))

  test('desktop stack anchors to the right edge, never the left', () => {
    expect(desktop).toMatch(/^\s+right:/m)
    expect(desktop).not.toMatch(/^\s+left:/m)
  })

  test('entry motion originates from the lower-right (positive X)', () => {
    const keyframe = scss.slice(scss.indexOf('@keyframes'))

    expect(keyframe).toMatch(/transform:\s*translate\(to-rem\(\$space-sm\)/)
    expect(keyframe).not.toMatch(/translate\(-/)
  })
})
