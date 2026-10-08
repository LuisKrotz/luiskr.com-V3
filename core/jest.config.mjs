/**
 * @file jest.config.mjs — core module test config.
 * Covers every core/** source: tokens, utils, router, store, jsx runtime,
 * firebase, safari patches, polyfills, and the canvas/wasm infrastructure.
 */
import { makeConfig } from '../shared/tests/jest.preset.mjs'

export default makeConfig({ name: 'core', dir: 'core' })
