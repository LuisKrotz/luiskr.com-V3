/**
 * @file experiments/star-field/vite.config.js
 * @description Library build for the `star-field` experiment. Emits
 * `experiments/star-field/dist/star-field.js` with shared deps kept external.
 */
import { moduleConfig } from '../../shared/build/vite-lib.mjs'

export default moduleConfig({
  dir: new URL('.', import.meta.url).pathname,
  name: 'star-field',
})
