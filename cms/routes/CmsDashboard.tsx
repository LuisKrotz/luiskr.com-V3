/**
 * @file CmsDashboard.js
 * @description <view-cms-dashboard> — the authenticated CMS shell: header
 * (brand + user + logout), the tab strip routing between content editors
 * (portfolio, projects, about, footers, playground, languages, media
 * converter — localhost only — and deploy info), and the toast surface
 * that child editors notify via cms-notification events.
 */

/** @jsx h */
import { CMS_EVENTS, CMS_TABS, CMS_TAGS } from '@cms/tokens.js'
import { DATA_ATTRS } from '@core/tokens/attrs/data.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { LABEL_TEXT } from '@core/tokens/strings/text.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import { logoutUser, onAuthChange } from '@core/firebase.js'
import cmsStyles from '@cms/sass/cms.scss?inline'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/about/CmsAboutEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/lang/CmsLangEditor.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import { IS_LOCALHOST } from '@cms/media-convert/CmsMediaConverter.js'
import '@cms/deploy-info/CmsDeployInfo.js'
import { CMS_ADMIN_CLASSES, CMS_DASHBOARD_CLASSES } from '@cms/tokens.js'

/**
 * The ViewCmsDashboard — cms dashboard class.
 */
export class ViewCmsDashboard extends BaseComponent {
  activeTab: string = CMS_TABS.PORTFOLIO // currently mounted editor tab
  user: import('firebase/auth').User | null = null // Firebase auth user (photo + email in header)
  toastMessage: string = ATTR_VALUES.EMPTY // transient notification text
  toastTimer: ReturnType<typeof setTimeout> | null = null // pending toast auto-dismiss
  unsubscribe: (() => void) | null = null // onAuthChange unsubscriber

  constructor() {
    super(cmsStyles)
  }

  /** Lifecycle: verifies auth session and binds tab/navigation events. */

  override async onMounted() {
    this._bindEvents()
    this.unsubscribe = await onAuthChange((currentUser) => {
      this.user = currentUser
      this._updateDom()
      this._bindEvents()
    })

    this.addScopedListener(this, CMS_EVENTS.NOTIFY, (e) => {
      const detail = (e as CustomEvent<string>).detail

      if (detail) this.showNotification(detail)
    })
  }

  /** Lifecycle: unbinds listeners. */

  override onDestroy() {
    if (this.unsubscribe) this.unsubscribe()
    if (this.toastTimer) clearTimeout(this.toastTimer)
  }

  /** Signs the user out (drops back to <admin-login> via auth listener). */

  async handleLogout(): Promise<void> {
    await logoutUser()
  }

  /**
   * Transient toast — writes the message, then auto-dismisses after
   * 3.5s (long enough to read a "saved!" confirmation, short enough to
   * not linger over the next edit). A second notification resets the
   * timer instead of stacking toasts.
   */
  showNotification(msg: string): void {
    this.toastMessage = msg
    const toast = this.$(`.${CMS_DASHBOARD_CLASSES.CMS_TOAST}`)
    if (toast) {
      toast.style.display = 'flex'
      const txt = toast.querySelector(`.${CMS_ADMIN_CLASSES.TOAST_TEXT}`)
      if (txt) txt.textContent = msg
    }
    if (this.toastTimer) clearTimeout(this.toastTimer)
    this.toastTimer = setTimeout(() => {
      this.toastMessage = ATTR_VALUES.EMPTY
      if (toast) toast.style.display = STATE_STRINGS.NONE
    }, 3500)
  }

  /** Wires tab clicks, logout and cms-notification events. */

  private _bindEvents(): void {
    const logoutBtn = this.$(`.${CMS_DASHBOARD_CLASSES.CMS_LOGOUT_BTN}`)
    if (logoutBtn) {
      this.addScopedListener(logoutBtn, MOUSE_EVENTS.CLICK, () => this.handleLogout())
    }

    const brand = this.$(`.${CMS_DASHBOARD_CLASSES.CMS_BRAND}`)
    if (brand) {
      this.addScopedListener(brand, MOUSE_EVENTS.CLICK, () =>
        window.location.assign(ROUTE_PATHS.ROOT)
      )
    }

    const tabs = this.$$(`.${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN}`)
    tabs.forEach((tab) => {
      this.addScopedListener(tab, MOUSE_EVENTS.CLICK, () => {
        const tabKey = tab.getAttribute(DATA_ATTRS.DATA_TAB)
        if (tabKey && this.activeTab !== tabKey) {
          this.activeTab = tabKey
          this._updateDom()
          this._bindEvents()
        }
      })
    })
  }

  /**
   * Tab → editor element mapping. The media-converter tab is localhost-
   * gated (IS_LOCALHOST): the conversion pipeline shells out to local
   * ffmpeg, so it only exists where the dev server runs.
   */
  renderTabComponent() {
    if (this.activeTab === CMS_TABS.PORTFOLIO) return <cms-portfolio-list />
    if (this.activeTab === CMS_TABS.PROJECTS) return <cms-projects-list />
    if (this.activeTab === CMS_TABS.ABOUT) return <cms-about-editor />
    if (this.activeTab === CMS_TABS.FOOTER) return <cms-footer-editor />
    if (this.activeTab === CMS_TABS.PLAYGROUND) return <cms-playground-editor />
    if (this.activeTab === CMS_TABS.LANGUAGES) return <cms-lang-editor />
    if (this.activeTab === CMS_TABS.MEDIA && IS_LOCALHOST) return <cms-media-converter />
    if (this.activeTab === CMS_TABS.DEPLOY) return <cms-deploy-info />
    return <cms-portfolio-list />
  }

  /** JSX template: sidebar + tab outlet. */

  override render() {
    return (
      <div className={CMS_DASHBOARD_CLASSES.CMS_CONTAINER}>
        <header className={CMS_DASHBOARD_CLASSES.CMS_HEADER}>
          <div className={CMS_DASHBOARD_CLASSES.CMS_BRAND}>
            <span className={CMS_DASHBOARD_CLASSES.CMS_LOGO}>LUIS KRÖTZ</span>
            <span className={CMS_DASHBOARD_CLASSES.CMS_BADGE}>CMS CONTROL PANEL</span>
          </div>

          <div className={CMS_DASHBOARD_CLASSES.CMS_USER_INFO}>
            {this.user?.photoURL ? (
              <img
                src={this.user.photoURL}
                alt="Avatar"
                className={CMS_DASHBOARD_CLASSES.CMS_AVATAR}
              />
            ) : null}
            <span className={CMS_DASHBOARD_CLASSES.CMS_EMAIL}>
              {this.user?.email || 'Admin User'}
            </span>
            <button className={CMS_DASHBOARD_CLASSES.CMS_LOGOUT_BTN} type={FORM_ATTRS.BUTTON}>
              {LABEL_TEXT.LOGOUT}
            </button>
          </div>
        </header>

        <nav className={CMS_DASHBOARD_CLASSES.CMS_NAV_TABS}>
          <button
            className={`${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN} ${this.activeTab === CMS_TABS.PORTFOLIO ? STATE_CLASSES.ACTIVE : ATTR_VALUES.EMPTY}`}
            data-tab={CMS_TABS.PORTFOLIO}
            type={FORM_ATTRS.BUTTON}
          >
            🖼️ Homepage &amp; Portfolio
          </button>
          <button
            className={`${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN} ${this.activeTab === CMS_TABS.PROJECTS ? STATE_CLASSES.ACTIVE : ATTR_VALUES.EMPTY}`}
            data-tab={CMS_TABS.PROJECTS}
            type={FORM_ATTRS.BUTTON}
          >
            📁 Project Case Studies
          </button>
          <button
            className={`${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN} ${this.activeTab === CMS_TABS.ABOUT ? STATE_CLASSES.ACTIVE : ATTR_VALUES.EMPTY}`}
            data-tab={CMS_TABS.ABOUT}
            type={FORM_ATTRS.BUTTON}
          >
            👤 About &amp; Gravatar
          </button>
          <button
            className={`${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN} ${this.activeTab === CMS_TABS.FOOTER ? STATE_CLASSES.ACTIVE : ATTR_VALUES.EMPTY}`}
            data-tab={CMS_TABS.FOOTER}
            type={FORM_ATTRS.BUTTON}
          >
            🦶 Footers &amp; Contact
          </button>
          <button
            className={`${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN} ${this.activeTab === CMS_TABS.PLAYGROUND ? STATE_CLASSES.ACTIVE : ATTR_VALUES.EMPTY}`}
            data-tab={CMS_TABS.PLAYGROUND}
            type={FORM_ATTRS.BUTTON}
          >
            🌍 Playground &amp; Lang Keys
          </button>
          <button
            className={`${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN} ${this.activeTab === CMS_TABS.LANGUAGES ? STATE_CLASSES.ACTIVE : ATTR_VALUES.EMPTY}`}
            data-tab={CMS_TABS.LANGUAGES}
            type={FORM_ATTRS.BUTTON}
          >
            🌐 Language Dictionary &amp; Keys
          </button>
          {IS_LOCALHOST ? (
            <button
              className={`${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN} ${this.activeTab === CMS_TABS.MEDIA ? STATE_CLASSES.ACTIVE : ATTR_VALUES.EMPTY}`}
              data-tab={CMS_TABS.MEDIA}
              type={FORM_ATTRS.BUTTON}
            >
              🎬 Media Converter <span className="cms-tab-badge">local</span>
            </button>
          ) : null}
          <button
            className={`${CMS_DASHBOARD_CLASSES.CMS_TAB_BTN} ${this.activeTab === CMS_TABS.DEPLOY ? STATE_CLASSES.ACTIVE : ATTR_VALUES.EMPTY}`}
            data-tab={CMS_TABS.DEPLOY}
            type={FORM_ATTRS.BUTTON}
          >
            📊 Deploy Info
          </button>
        </nav>

        <main className={CMS_DASHBOARD_CLASSES.CMS_MAIN_CONTENT}>{this.renderTabComponent()}</main>

        <div
          className={CMS_DASHBOARD_CLASSES.CMS_TOAST}
          style={{ display: this.toastMessage ? 'flex' : STATE_STRINGS.NONE }}
        >
          <span>✨</span>
          <span className={CMS_ADMIN_CLASSES.TOAST_TEXT}>{this.toastMessage}</span>
        </div>
      </div>
    )
  }
}

if (!customElements.get(CMS_TAGS.VIEW_CMS_DASHBOARD)) {
  customElements.define(CMS_TAGS.VIEW_CMS_DASHBOARD, ViewCmsDashboard)
}
