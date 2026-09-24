/** @jsx h */
import { h } from '../core/jsx.js'
import { BaseComponent } from '../core/Component.js'
import router from '../core/router.js'
import { logoutUser, onAuthChange } from '../firebase.js'
import cmsStyles from '../sass/cms.scss?inline'
import '../components/cms/CmsPortfolioList.js'
import '../components/cms/CmsProjectsList.js'
import '../components/cms/CmsAboutEditor.js'
import '../components/cms/CmsFooterEditor.js'
import '../components/cms/CmsLangEditor.js'
import { CMS_CLASSES, CMS_TAGS, CMS_EVENTS } from '../core/cms/tokens.js'
import { ATTRS, EVENTS, PATHS, STRINGS, TEXT } from '../core/constants.js'

export class ViewCmsDashboard extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.activeTab = 'portfolio'
    this.user = null
    this.toastMessage = ATTRS.EMPTY
    this.toastTimer = null
    this.unsubscribe = null
  }

  async onMounted() {
    this._bindEvents()
    this.unsubscribe = await onAuthChange((currentUser) => {
      this.user = currentUser
      if (!currentUser) {
        router.push(`${PATHS.ROOT}admin`)
      } else {
        this._updateDom()
        this._bindEvents()
      }
    })

    this.addScopedListener(this, CMS_EVENTS.NOTIFY, (e) => {
      if (e.detail) this.showNotification(e.detail)
    })
  }

  onDestroy() {
    if (this.unsubscribe) this.unsubscribe()
    if (this.toastTimer) clearTimeout(this.toastTimer)
  }

  async handleLogout() {
    await logoutUser()
    router.push(`${PATHS.ROOT}admin`)
  }

  showNotification(msg) {
    this.toastMessage = msg
    const toast = this.$(`.${CMS_CLASSES.CMS_TOAST}`)
    if (toast) {
      toast.style.display = 'flex'
      const txt = toast.querySelector(`.${CMS_CLASSES.TOAST_TEXT}`)
      if (txt) txt.textContent = msg
    }
    if (this.toastTimer) clearTimeout(this.toastTimer)
    this.toastTimer = setTimeout(() => {
      this.toastMessage = ATTRS.EMPTY
      if (toast) toast.style.display = STRINGS.NONE
    }, 3500)
  }

  _bindEvents() {
    const logoutBtn = this.$(`.${CMS_CLASSES.CMS_LOGOUT_BTN}`)
    if (logoutBtn) {
      this.addScopedListener(logoutBtn, EVENTS.CLICK, () => this.handleLogout())
    }

    const tabs = this.$$(`.${CMS_CLASSES.CMS_TAB_BTN}`)
    tabs.forEach((tab) => {
      this.addScopedListener(tab, EVENTS.CLICK, () => {
        const tabKey = tab.getAttribute('data-tab')
        if (tabKey && this.activeTab !== tabKey) {
          this.activeTab = tabKey
          this._updateDom()
          this._bindEvents()
        }
      })
    })
  }

  renderTabComponent() {
    if (this.activeTab === 'portfolio') return <cms-portfolio-list />
    if (this.activeTab === 'projects') return <cms-projects-list />
    if (this.activeTab === 'about') return <cms-about-editor />
    if (this.activeTab === 'footer') return <cms-footer-editor />
    if (this.activeTab === 'languages') return <cms-lang-editor />
    return <cms-portfolio-list />
  }

  render() {
    return (
      <div className={CMS_CLASSES.CMS_CONTAINER}>
        <header className={CMS_CLASSES.CMS_HEADER}>
          <div className={CMS_CLASSES.CMS_BRAND}>
            <span className={CMS_CLASSES.CMS_LOGO}>LUIS KRÖTZ</span>
            <span className={CMS_CLASSES.CMS_BADGE}>CMS CONTROL PANEL</span>
          </div>

          <div className={CMS_CLASSES.CMS_USER_INFO}>
            {this.user?.photoURL ? (
              <img
                src={this.user.photoURL}
                alt="Avatar"
                className={CMS_CLASSES.CMS_AVATAR}
              />
            ) : null}
            <span className={CMS_CLASSES.CMS_EMAIL}>
              {this.user?.email || 'Admin User'}
            </span>
            <button className={CMS_CLASSES.CMS_LOGOUT_BTN} type={ATTRS.BUTTON}>
              {TEXT.LOGOUT}
            </button>
          </div>
        </header>

        <nav className={CMS_CLASSES.CMS_NAV_TABS}>
          <button
            className={`${CMS_CLASSES.CMS_TAB_BTN} ${this.activeTab === 'portfolio' ? 'active' : ''}`}
            data-tab="portfolio"
            type={ATTRS.BUTTON}
          >
            🖼️ Homepage &amp; Portfolio
          </button>
          <button
            className={`${CMS_CLASSES.CMS_TAB_BTN} ${this.activeTab === 'projects' ? 'active' : ''}`}
            data-tab="projects"
            type={ATTRS.BUTTON}
          >
            📁 Project Case Studies
          </button>
          <button
            className={`${CMS_CLASSES.CMS_TAB_BTN} ${this.activeTab === 'about' ? 'active' : ''}`}
            data-tab="about"
            type={ATTRS.BUTTON}
          >
            👤 About &amp; Gravatar
          </button>
          <button
            className={`${CMS_CLASSES.CMS_TAB_BTN} ${this.activeTab === 'footer' ? 'active' : ''}`}
            data-tab="footer"
            type={ATTRS.BUTTON}
          >
            🦶 Footers &amp; Contact
          </button>
          <button
            className={`${CMS_CLASSES.CMS_TAB_BTN} ${this.activeTab === 'languages' ? 'active' : ''}`}
            data-tab="languages"
            type={ATTRS.BUTTON}
          >
            🌐 Language Dictionary &amp; Keys
          </button>
        </nav>

        <main className={CMS_CLASSES.CMS_MAIN_CONTENT}>
          {this.renderTabComponent()}
        </main>

        <div
          className={CMS_CLASSES.CMS_TOAST}
          style={{ display: this.toastMessage ? 'flex' : STRINGS.NONE }}
        >
          <span>✨</span>
          <span className={CMS_CLASSES.TOAST_TEXT}>{this.toastMessage}</span>
        </div>
      </div>
    )
  }
}

if (!customElements.get(CMS_TAGS.VIEW_CMS_DASHBOARD)) {
  customElements.define(CMS_TAGS.VIEW_CMS_DASHBOARD, ViewCmsDashboard)
}
