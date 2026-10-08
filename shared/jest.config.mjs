/**
 * @file jest.config.mjs — shared workspace test config.
 * Covers the app shell (shared/src) plus cross-cutting suites: governance
 * scans, test fixtures, and the coverage sweeps that span modules.
 */
import { makeConfig } from './tests/jest.preset.mjs'

export default makeConfig({ name: 'shared', dir: 'shared' })
