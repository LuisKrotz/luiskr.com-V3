/**
 * @file experiments/docs/vite.config.js
 * @description Library build for the `docs` experiment — the in-app
 * documentation portal (tree navigation, markdown/mermaid/coverage renderers,
 * Three.js architecture scene). `virtual:docs-manifest` and mermaid/marked
 * stay external; the host app provides them. Emits
 * `experiments/docs/dist/docs.js`.
 */
import { moduleConfig } from '../../shared/build/vite-lib.mjs'

export default moduleConfig({ dir: new URL('.', import.meta.url).pathname, name: 'docs' })
