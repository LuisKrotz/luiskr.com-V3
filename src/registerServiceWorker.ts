/**
 * @file registerServiceWorker.js
 * @description Registers the Workbox-generated service worker in production
 * only. Lifecycle hooks log status; an available update triggers a hard
 * reload so users never run a stale app shell behind new assets.
 */

import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { register } from 'register-service-worker'
import { devError, devInfo } from '@core/devlog.js'

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
        devInfo(
          'App is being served from cache by a service worker.\n' +
            'For more details, visit https://goo.gl/AFskqB'
        )
      },
      registered() {
        devInfo('Service worker has been registered.')
      },
      cached() {
        devInfo('Content has been cached for offline use.')
      },
      updatefound() {
        devInfo('New content is downloading.')
      },
      updated() {
        devInfo('New content is available; refreshing page.')
        window.location.reload()
      },
      offline() {
        devInfo('No internet connection found. App is running in offline mode.')
      },
      error(error) {
        devError('Error during service worker registration:', error)
      },
    })
  })
}

// `import.meta.env` only exists under Vite — guard so tests/other loaders can
// import this module without a build-time env shim.
const env = (typeof import.meta !== TYPE_STRINGS.UNDEFINED && import.meta.env) || {}

registerServiceWorker(env)
