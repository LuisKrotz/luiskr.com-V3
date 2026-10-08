/**
 * @file lighthouse-config.test.js
 * @description Governance gate for the Lighthouse CI config — asserts the
 * audited route list stays in sync with the router's real paths (sample
 * projects, legal pages, playground) so a renamed route can't silently
 * drop out of performance auditing.
 */

import { describe, test, expect } from '@jest/globals'
import fs from 'node:fs'
import path from 'node:path'
import { TEST_PROJECTS } from '@tests/fixtures/test-constants.js'
import { ROUTE_STRINGS } from '@core/tokens/strings/routes.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'

const LIGHTHOUSE_BASE = 'http://localhost:4173'
const SAMPLE_PROJECT_MELISSA = 'melissa'
const SAMPLE_PROJECT_METCHA = TEST_PROJECTS.METCHA

describe('Lighthouse CI configuration', () => {
  const configPath = path.resolve('lighthouserc.cjs')

  test('lighthouserc.cjs exists', () => {
    expect(fs.existsSync(configPath)).toBe(true)
  })

  test('config audits all required routes', async () => {
    const config = await import(configPath)
    const urls = config?.default?.ci?.collect?.url || []

    const required = [
      `${LIGHTHOUSE_BASE}/`,
      `${LIGHTHOUSE_BASE}/${ROUTE_STRINGS.ABOUT}`,
      `${LIGHTHOUSE_BASE}/${ROUTE_STRINGS.CONTACT}`,
      `${LIGHTHOUSE_BASE}${ROUTE_PATHS.TERMS_OF_USE}`,
      `${LIGHTHOUSE_BASE}${ROUTE_PATHS.PRIVACY_POLICY}`,
      `${LIGHTHOUSE_BASE}${ROUTE_PATHS.GDPR}`,
      `${LIGHTHOUSE_BASE}/${ROUTE_PATHS.PORTFOLIO_SEGMENT}/${SAMPLE_PROJECT_MELISSA}`,
      `${LIGHTHOUSE_BASE}/${ROUTE_PATHS.PORTFOLIO_SEGMENT}/${SAMPLE_PROJECT_METCHA}`,
    ]

    for (const route of required) {
      expect(urls).toContain(route)
    }
  })

  test('config enforces minimum performance and 100% other categories', async () => {
    const config = await import(configPath)
    const assertions = config?.default?.ci?.assert?.assertions || {}

    // Performance is exempt from the hard gate by project policy (WebGL-heavy
    // pages) — asserted as 'warn' so regressions surface without failing CI.
    expect(assertions['categories:performance']).toEqual(
      expect.arrayContaining(['warn', expect.objectContaining({ minScore: 0.95 })])
    )

    expect(assertions['categories:accessibility']).toEqual(
      expect.arrayContaining([WINDOW_EVENTS.ERROR, expect.objectContaining({ minScore: 1 })])
    )

    expect(assertions['categories:best-practices']).toEqual(
      expect.arrayContaining([WINDOW_EVENTS.ERROR, expect.objectContaining({ minScore: 1 })])
    )

    expect(assertions['categories:seo']).toEqual(
      expect.arrayContaining([WINDOW_EVENTS.ERROR, expect.objectContaining({ minScore: 1 })])
    )
  })
})
