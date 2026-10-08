/**
 * @file experiments/earth-playground/vite.config.js
 * @description Library build for the `earth-playground` experiment — the
 * WebGPU Earth scene and space-playground editor. Emits
 * `experiments/earth-playground/dist/earth-playground.js` with @core/three
 * kept external.
 */
import { moduleConfig } from '../../build/vite-lib.mjs'

export default moduleConfig({
  dir: new URL('.', import.meta.url).pathname,
  name: 'earth-playground',
})
