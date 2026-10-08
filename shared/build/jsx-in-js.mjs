#!/usr/bin/env node
/**
 * @file jsx-in-js.mjs — shared transform for `.js` sources that contain JSX.
 * Some legacy files keep a `.js` extension while returning JSX; esbuild only
 * applies the JSX loader to extensions it recognizes, so this plugin scans
 * authored module dirs for JSX-looking `.js` sources and runs them through
 * Vite's OXC transform with the classic `h`/`Fragment` pragma. Shared by the
 * root app config and every module config via `moduleConfig()`.
 */

/**
 * Builds the jsx-in-js vite plugin.
 * @returns {import('vite').Plugin} The plugin instance.
 */
export const jsxInJsPlugin = () => ({
  name: 'vite-plugin-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (
      !id.includes('node_modules') &&
      /\/(shared|core|website|cms|experiments)\//.test(id) &&
      id.endsWith('.js') &&
      (code.includes('</') || code.includes('/>'))
    ) {
      const { transformWithOxc } = await import('vite')
      const res = await transformWithOxc(code, id.replace(/\.js$/, '.jsx'), {
        jsx: { runtime: 'classic', pragma: 'h', pragmaFrag: 'Fragment' },
      })
      return {
        code: res.code,
        map: res.map,
      }
    }
  },
})

/**
 * The esbuild options every pipeline shares: classic JSX transform with the
 * `h` pragma, scoped to the authored module dirs. `jsx: 'transform'` is
 * required for the esbuild→oxc config bridge to map jsxFactory/jsxFragment
 * onto pragma/pragmaFrag — without it the mapping is skipped and .tsx would
 * fall back to the automatic runtime.
 */
export const SHARED_ESBUILD = {
  jsx: 'transform',
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  loader: 'jsx',
  include: /\/(shared|core|website|cms|experiments)\/.*\.[jt]sx?$/,
  legalComments: 'none',
  treeShaking: true,
}
