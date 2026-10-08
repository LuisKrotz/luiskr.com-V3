#!/usr/bin/env node
/**
 * @file vite-lib.mjs
 * @description Shared factory for the per-module Vite library builds. Every
 * module folder (core/, website/, cms/, experiments/earth-playground/,
 * experiments/docs/) carries a thin `vite.config.js` that calls
 * `moduleConfig()` so cross-module resolution stays identical everywhere and
 * each build emits only its own folder as an ES library.
 *
 * External policy: all area aliases (@core, @website, @cms, @earth, @docs,
 * @/) and every runtime dependency stay external — a module build bundles
 * only its own sources, never a sibling module or a third-party package, so
 * the emitted graph mirrors the workspace layout exactly.
 */

import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { modulePublicPlugin } from './module-public.mjs'
import { i18nBootPlugin, i18nFallbackPlugin } from './i18n-virtual.mjs'
import { docsPortalPlugin } from './docs-portal.mjs'
import { jsxInJsPlugin, SHARED_ESBUILD } from './jsx-in-js.mjs'

const REPO = fileURLToPath(new URL('../..', import.meta.url))

/**
 * The canonical alias map — single declaration consumed by every module
 * config so a moved folder only ever changes here and in the root config.
 */
export const MODULE_ALIASES = {
  '@': `${REPO}shared/src`,
  '@core': `${REPO}core`,
  '@website': `${REPO}website`,
  '@cms': `${REPO}cms`,
  '@earth': `${REPO}experiments/earth-playground`,
  '@docs': `${REPO}experiments/docs`,
}

/** Runtime specifiers that must never be inlined into a module bundle. */
const EXTERNALS = [
  /^@core($|\/)/,
  /^@website($|\/)/,
  /^@cms($|\/)/,
  /^@earth($|\/)/,
  /^@docs($|\/)/,
  /^@($|\/)/,
  /^virtual:/,
  /^three($|\/)/,
  /^firebase($|\/)/,
  'mermaid',
  'marked',
]

/**
 * Builds a Vite library config for one module folder.
 * @param {object} opts Options.
 * @param {string} opts.dir Absolute path of the module folder.
 * @param {string} opts.name Bundle file stem emitted under dist/.
 * @param {string} [opts.entry] Barrel entry relative to `dir` (default index.ts).
 * @param {string} [opts.target] esbuild/terser target — cms passes 'esnext'
 *   (author tool: no Safari/legacy constraint), the rest inherit it anyway.
 * @returns {import('vite').UserConfig} The module build config.
 */
export const moduleConfig = ({ dir, name, entry = 'index.ts', target = 'esnext' }) =>
  defineConfig({
    // Standalone `vite dev` in a module folder serves its own public/ at /
    // (vite default) plus every module mount at its URL prefix — identical
    // asset URLs to the root build, so experiments run in isolation. The
    // i18n/docs virtual modules and the JSX pipeline are required whenever
    // site sources load, so they are part of every module pipeline.
    plugins: [
      modulePublicPlugin(),
      i18nFallbackPlugin({ root: REPO }),
      i18nBootPlugin({ root: REPO }),
      docsPortalPlugin({ root: REPO, emitAssets: false }),
      jsxInJsPlugin(),
    ],
    esbuild: { ...SHARED_ESBUILD },
    resolve: { alias: { ...MODULE_ALIASES } },
    css: {
      preprocessorOptions: {
        scss: { silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api'] },
      },
    },
    build: {
      target,
      outDir: `${dir}/dist`,
      emptyOutDir: true,
      lib: {
        entry: `${dir}/${entry}`,
        formats: ['es'],
        fileName: () => `${name}.js`,
      },
      rollupOptions: { external: EXTERNALS },
    },
  })
