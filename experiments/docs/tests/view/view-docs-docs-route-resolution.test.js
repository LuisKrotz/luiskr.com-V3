/**
 * @file view-docs-docs-route-resolution.test.js
 * @description Split from view-docs.test.js — covers the "docs route resolution" describe.
 */
import { describe, test, expect } from '@jest/globals'
import router from '@core/router/router.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'

const _makePayload = (over = {}) => ({
  name: 'website.md',
  path: 'docs/architecture/website.md',
  format: 'markdown',
  html: '<article><h1>Website</h1><p>rendered</p></article>',
  media: null,
  mtime: '2024-06-01T12:00:00.000Z',
  ...over,
})

const _docsRoute = (docsPath = '') => ({
  name: ROUTE_NAMES.DOCS,
  view: VIEW_TAGS.VIEW_DOCS,
  lang: 'en',
  path: `${ROUTE_PATHS.DOCS}${docsPath ? `/${docsPath}` : ''}`,
  meta: { docsRoute: true },
  params: { docsPath },
})

describe('docs route resolution', () => {
  test('/docs resolves to view-docs with docsRoute meta', () => {
    const r = router.resolve(ROUTE_PATHS.DOCS)

    expect(r.view).toBe(VIEW_TAGS.VIEW_DOCS)
    expect(r.meta.docsRoute).toBe(true)
    expect(r.name).toBe(ROUTE_NAMES.DOCS)
    expect(r.params.docsPath).toBe('')
  })

  test('nested docs path lands in params.docsPath', () => {
    const r = router.resolve(`${ROUTE_PATHS.DOCS}/docs/architecture/website.md`)

    expect(r.params.docsPath).toBe('docs/architecture/website.md')
  })

  test('locale-prefixed /docs keeps the docsRoute flag', () => {
    const r = router.resolve(`/br${ROUTE_PATHS.DOCS}/reports`)

    expect(r.meta.docsRoute).toBe(true)
    expect(r.lang).toBe('br')
    expect(r.params.docsPath).toBe('reports')
  })
})
