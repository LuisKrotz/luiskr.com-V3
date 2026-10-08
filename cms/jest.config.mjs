/**
 * @file jest.config.mjs — cms module test config.
 * Covers cms/** editors, routes, media-convert pipeline, and tokens.
 * Per the workspace contract the CMS runs no a11y/contrast scans.
 */
import { makeConfig } from '../shared/tests/jest.preset.mjs'

export default makeConfig({ name: 'cms', dir: 'cms' })
