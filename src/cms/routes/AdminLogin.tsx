/**
 * @file AdminLogin.js
 * @description <view-admin-login> — the CMS gate: a single Google OAuth
 * sign-in card rendered when the auth listener reports no session.
 * Success flips cms/main.js over to <view-cms-dashboard>; errors surface
 * inline (cancelled popups stay silent — that's a user action, not a
 * failure).
 */

/** @jsx h */
import { CMS_TAGS } from '@/cms/tokens.js'
import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { MOUSE_EVENTS } from '@/core/tokens/events/dom.js'
import { AUTH_STRINGS } from '@/core/tokens/strings/auth.js'
import { h } from '@/core/jsx.js'
import { BaseComponent } from '@/core/Component.js'
import { signInWithGoogle } from '@/firebase.js'
import cmsStyles from '@/cms/sass/cms.scss?inline'
import { CMS_ADMIN_CLASSES } from '@/cms/tokens.js'
import { devError } from '@/core/devlog.js'

/**
 * The ViewAdminLogin — admin login class.
 */
export class ViewAdminLogin extends BaseComponent {
  loading = false // OAuth round-trip in flight — disables the button
  errorMsg: string = ATTR_VALUES.EMPTY // last sign-in error rendered under the button
  private _loginInProgress = false // re-entrancy guard (double-click → duplicate popup error)

  constructor() {
    super(cmsStyles)
  }

  /** Lifecycle: binds the login button. */

  override onMounted() {
    this._bindEvents()
  }

  /** Wires the Google sign-in button click. */

  private _bindEvents(): void {
    const btn = this.$(`.${CMS_ADMIN_CLASSES.GOOGLE_AUTH_BTN}`)
    if (btn) {
      this.addScopedListener(btn, MOUSE_EVENTS.CLICK, () => this.handleGoogleLogin())
    }
  }

  /** Runs the Firebase Google OAuth popup flow; errors surface in the UI. */

  async handleGoogleLogin(): Promise<void> {
    // Guard: prevent duplicate popup calls that cause auth/cancelled-popup-request
    if (this._loginInProgress) return
    this._loginInProgress = true
    this.loading = true
    this.errorMsg = ATTR_VALUES.EMPTY
    this._updateDom()
    this._bindEvents()

    try {
      await signInWithGoogle()
    } catch (err) {
      // Suppress cancelled-popup noise (user closed the popup)
      const e = err as { code?: string; message?: string }

      if (
        e?.code === AUTH_STRINGS.ERR_CANCELLED_POPUP ||
        e?.code === AUTH_STRINGS.ERR_POPUP_CLOSED
      ) {
        this.errorMsg = ATTR_VALUES.EMPTY
      } else {
        devError('Google Sign-In Error:', err)
        this.errorMsg = e.message || 'Failed to sign in with Google.'
      }
      this._updateDom()
      this._bindEvents()
    } finally {
      this.loading = false
      this._loginInProgress = false
      this._updateDom()
      this._bindEvents()
    }
  }

  /** JSX template for the login card. */

  override render() {
    return (
      <div className={CMS_ADMIN_CLASSES.ADMIN_LOGIN_WRAPPER}>
        <div className={CMS_ADMIN_CLASSES.ADMIN_LOGIN_CARD}>
          <h1 className={CMS_ADMIN_CLASSES.ADMIN_TITLE}>Luis Krötz CMS</h1>
          <p className={CMS_ADMIN_CLASSES.ADMIN_SUBTITLE}>
            Sign in to manage portfolio content, projects &amp; translations
          </p>

          <button
            className={CMS_ADMIN_CLASSES.GOOGLE_AUTH_BTN}
            disabled={this.loading}
            type={FORM_ATTRS.BUTTON}
            onClick={() => this.handleGoogleLogin()}
          >
            <svg
              className={CMS_ADMIN_CLASSES.GOOGLE_ICON}
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{this.loading ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>

          {this.errorMsg ? (
            <div className={CMS_ADMIN_CLASSES.ADMIN_ERROR_MSG}>{this.errorMsg}</div>
          ) : null}
        </div>
      </div>
    )
  }
}

if (!customElements.get(CMS_TAGS.VIEW_ADMIN_LOGIN)) {
  customElements.define(CMS_TAGS.VIEW_ADMIN_LOGIN, ViewAdminLogin)
}
