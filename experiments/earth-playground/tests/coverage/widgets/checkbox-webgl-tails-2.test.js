/**
 * @file checkbox-webgl-tails-2.test.js
 * @description Split from coverage-tails-4.test.js — covers the "checkbox-webgl tails 2" describe.
 */
import { CheckboxWebGL } from '@earth/space/checkbox-webgl.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

describe('checkbox-webgl tails 2', () => {
  test('init guard, default callback and running-loop setChecked', () => {
    const orphan = new CheckboxWebGL(null)

    orphan.init()

    expect(orphan.ctx2d).toBeNull()

    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const cb = new CheckboxWebGL(canvas)

    cb.animId = 1
    cb.setChecked(false)
    cb.destroy()
  })
})
