/**
 * @file jest.config.mjs — star-field module test config.
 * Covers the experiment code under experiments/star-field.
 * Experiments are exempt from Lighthouse performance gates by contract.
 */
import { makeConfig } from '../../shared/tests/jest.preset.mjs'

export default makeConfig({ name: 'star-field', dir: 'experiments/star-field' })
