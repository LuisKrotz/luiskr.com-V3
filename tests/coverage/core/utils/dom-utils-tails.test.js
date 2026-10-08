/**
 * @file coverage-tails-5.test.js
 * @description Fifth branch-tail sweep: gpu-accel compositing + texture
 * paths, stats-engine observers and fetch patch, wasm-media-threads
 * probes, Legal route data modes, router canonical/history edges,
 * firebase REST fallback, deep-shadow DOM traversal, burger resize
 * branches, legacy polyfill bodies, wasm-scroll option shapes and
 * Home route param changes.
 */

import _router from '@core/router/router.js'

import { deepQuerySelector, deepQuerySelectorAll } from '@core/utils/dom.js'

import '@website/views/legal/Legal.js'
import '@website/views/home/Home.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { SVG_STRINGS } from '@core/tokens/strings/svg.js'





// ─── utils/gpu-accel.js ──────────────────────────────────────────────────────

describe('dom-utils tails', () => {
  test('deep selectors pierce shadow roots and guard null roots', () => {
    expect(deepQuerySelector('anything', null)).toBeNull()
    expect(deepQuerySelectorAll('anything', null).length).toBe(0)

    const host = document.createElement(HTML_TAGS.DIV)
    const inner = document.createElement(HTML_TAGS.SPAN)

    host.appendChild(inner)
    document.body.appendChild(host)

    expect(deepQuerySelector(HTML_TAGS.SPAN)).toBe(inner)
    expect(deepQuerySelectorAll(HTML_TAGS.SPAN).length).toBeGreaterThanOrEqual(1)
    expect(deepQuerySelector('no-such-thing-xyz')).toBeNull()

    host.remove()
  })

  test('traversal recurses through shadow roots in both helpers', () => {
    const host = document.createElement(HTML_TAGS.DIV)

    document.body.appendChild(host)

    const shadow = host.attachShadow({ mode: COMMON_ATTRS.OPEN })
    const inner = document.createElement(HTML_TAGS.SPAN)

    shadow.appendChild(inner)

    // a sibling without a shadow root exercises the `child.shadowRoot` else arm
    const plain = document.createElement(HTML_TAGS.DIV)

    document.body.appendChild(plain)

    expect(deepQuerySelector(HTML_TAGS.SPAN, document.body)).toBe(inner)
    expect(deepQuerySelectorAll(HTML_TAGS.SPAN, document.body)).toContain(inner)
    expect(deepQuerySelectorAll(HTML_TAGS.SPAN, host).length).toBe(0)

    // shadow exists but holds no match → the `found`-null loop arm
    expect(deepQuerySelector('nonexistent-tag-xyz', document.body)).toBeNull()

    host.remove()
    plain.remove()
  })

  test('roots lacking query APIs fall through to empty results', () => {
    const bare = {}

    expect(deepQuerySelector(HTML_TAGS.SPAN, bare)).toBeNull()
    expect(deepQuerySelectorAll(HTML_TAGS.SPAN, bare)).toEqual([])
  })

  test('document-less default-arg arm resolves to a null root', () => {
    const prevDocument = globalThis.document

    delete globalThis.document

    expect(deepQuerySelector(HTML_TAGS.SPAN)).toBeNull()
    expect(deepQuerySelectorAll(HTML_TAGS.SPAN)).toEqual([])

    globalThis.document = prevDocument
  })

  test('svgPlaceholder emits defaults and explicit dimensions', async () => {
    const { svgPlaceholder } = await import('@core/utils/dom.js')

    expect(svgPlaceholder()).toContain(SVG_STRINGS.SVG_DATA_URI_PREFIX)
    expect(svgPlaceholder(10, 20)).toContain(encodeURIComponent('10 20'))
  })
})

