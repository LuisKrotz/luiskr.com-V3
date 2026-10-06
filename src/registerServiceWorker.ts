/**
 * @file registerServiceWorker.js
 * @description Registers the Workbox-generated service worker in production
 * only. Lifecycle hooks log status; an available update triggers a hard
 * reload so users never run a stale app shell behind new assets.
 */

import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { register } from 'register-service-worker'

/**
 * Registers `<base>service-worker.js` on window load when `env.PROD` is set.
 * Exported (and env-injected) so the prod-only branch is exercisable in
 * tests — `import.meta.env` does not exist outside Vite.
 * @param {object} env - Vite env object ({PROD, BASE_URL})
 */
export const registerServiceWorker = (env: { PROD?: boolean; BASE_URL?: string }): void => {
  if (!env?.PROD) return

  window.addEventListener('load', () => {
    register(`${env.BASE_URL}service-worker.js`, {
      ready() {
        console.info(
          'App is being served from cache by a service worker.\n' +
            'For more details, visit https://goo.gl/AFskqB'
        )
      },
      registered() {
        console.info('Service worker has been registered.')
      },
      cached() {
        console.info('Content has been cached for offline use.')
      },
      updatefound() {
        console.info('New content is downloading.')
      },
      updated() {
        console.info('New content is available; refreshing page.')
        window.location.reload()
      },
      offline() {
        console.info('No internet connection found. App is running in offline mode.')
      },
      error(error) {
        console.error('Error during service worker registration:', error)
      },
    })
  })
}

// `import.meta.env` only exists under Vite — guard so tests/other loaders can
// import this module without a build-time env shim.
const env = (typeof import.meta !== TYPE_STRINGS.UNDEFINED && import.meta.env) || {}

registerServiceWorker(env)
