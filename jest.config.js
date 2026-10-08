/**
 * @file jest.config.js — root aggregate config = the shared workspace slice.
 * `yarn test` runs every module config sequentially via
 * shared/scripts/test/run-modules.mjs (memory-safe ordering); this file
 * exists so a bare `jest` invocation still runs a meaningful slice — the
 * shared workspace (app shell + governance + fixtures) — with the same
 * RAM-derived worker budget every module uses.
 */
export { default } from './shared/jest.config.mjs'
