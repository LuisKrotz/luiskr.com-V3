/**
 * @file jest.config.mjs — website module test config.
 * Covers website/** — views (home, legal, 404, project) and all public-site
 * components — against its own suites under website/tests.
 */
import { makeConfig } from '../shared/tests/jest.preset.mjs'

export default makeConfig({ name: 'website', dir: 'website' })
