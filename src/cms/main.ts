/**
 * @file main.js (cms)
 * @description CMS bundle entry — completely separate from the public site
 * entry. Mounts <admin-login> or <cms-dashboard> into #cms-root based on the
 * Firebase auth session, and re-swaps on the auth-changed event.
 * This bundle is only served under the /cms build output and is excluded
 * from indexing (robots + X-Robots-Tag).
 */

import { CMS_EVENTS, CMS_TAGS } from '@/cms/tokens.js'
import { CMS_IDS } from '@/core/tokens/ids/cms.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { onAuthChange } from '@/firebase.js'
// Document-level copy of the CMS stylesheet — publishes :root tokens and the
// html/body base that per-component `?inline` shadow copies cannot cover.
import '@/cms/sass/cms.scss'
import '@/cms/routes/AdminLogin.js'
import '@/cms/routes/CmsDashboard.js'

const root = document.getElementById(CMS_IDS.CMS_ROOT)

let currentTag: string = CHAR_STRINGS.EMPTY

/** Swaps the CMS root's child for the given element tag (idempotent). */
function mountView(tag: string): void {
  if (!root || currentTag === tag) return

  currentTag = tag

  root.replaceChildren(document.createElement(tag))
}

/** Boots the CMS: first auth callback decides the initial view. */
async function boot() {
  await onAuthChange((user) => {
    mountView(user ? CMS_TAGS.VIEW_CMS_DASHBOARD : CMS_TAGS.VIEW_ADMIN_LOGIN)
  })
}

window.addEventListener(CMS_EVENTS.AUTH_CHANGED, (e) => {
  mountView((e as CustomEvent).detail ? CMS_TAGS.VIEW_CMS_DASHBOARD : CMS_TAGS.VIEW_ADMIN_LOGIN)
})

boot()
