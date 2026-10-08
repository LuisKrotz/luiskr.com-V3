/**
 * @file jest.config.mjs — earth-playground module test config.
 * Covers the earth/space experiment code under experiments/earth-playground.
 * Experiments are exempt from Lighthouse performance gates by contract.
 */
import { makeConfig } from '../../shared/tests/jest.preset.mjs'

export default makeConfig({ name: 'earth-playground', dir: 'experiments/earth-playground' })
