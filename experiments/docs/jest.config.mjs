/**
 * @file jest.config.mjs — docs-portal module test config.
 * Covers experiments/docs/** — the viewer, manifest, arch scene, coverage
 * navigation, and mermaid pipeline. Exempt from Lighthouse by contract.
 */
import { makeConfig } from '../../shared/tests/jest.preset.mjs'

export default makeConfig({ name: 'docs-portal', dir: 'experiments/docs' })
