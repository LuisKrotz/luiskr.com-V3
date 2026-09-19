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
import { CLASSES, TAGS } from '../core/constants.js'

export class ViewCmsDashboard extends BaseComponent {
  constructor() {
    super(cmsStyles)
    this.activeTab = 'portfolio'
    this.user = null
    this.toastMessage = ''
    this.toastTimer = null
    this.unsubscribe = null
    this.languages = ['en', 'br', 'es', 'de', 'hrk', 'cas', 'riv', 'gn', 'it', 'ru', 'fr', 'tln']
  }

  async onMounted() {
    this._bindEvents()
    this.unsubscribe = await onAuthChange((currentUser) => {
      this.user = currentUser
      if (!currentUser) {
        router.push('/admin')
      } else {
        this._updateDom()
        this._bindEvents()
      }
    })

    this.addScopedListener(this, 'notify', (e) => {
      if (e.detail) this.showNotification(e.detail)
    })
  }

  onDestroy() {
    if (this.unsubscribe) this.unsubscribe()
    if (this.toastTimer) clearTimeout(this.toastTimer)
  }

  async handleLogout() {
    await logoutUser()
    router.push('/admin')
  }

  showNotification(msg) {
    this.toastMessage = msg
    const toast = this.$(`.${CLASSES.CMS_TOAST}`)
    if (toast) {
      toast.style.display = 'flex'
      const txt = toast.querySelector(`.${CLASSES.TOAST_TEXT}`)
      if (txt) txt.textContent = msg
    }
    if (this.toastTimer) clearTimeout(this.toastTimer)
    this.toastTimer = setTimeout(() => {
      this.toastMessage = ''
      if (toast) toast.style.display = 'none'
    }, 3500)
  }

  _bindEvents() {
    const logoutBtn = this.$(`.${CLASSES.CMS_LOGOUT_BTN}`)
    if (logoutBtn) {
      this.addScopedListener(logoutBtn, 'click', () => this.handleLogout())
    }

    const tabs = this.$$(`.${CLASSES.CMS_TAB_BTN}`)
    tabs.forEach((tab) => {
      this.addScopedListener(tab, 'click', () => {
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
      <div className={CLASSES.CMS_CONTAINER}>
        <header className={CLASSES.CMS_HEADER}>
          <div className={CLASSES.CMS_BRAND}>
            <span className={CLASSES.CMS_LOGO}>LUIS KRÖTZ</span>
            <span className={CLASSES.CMS_BADGE}>CMS CONTROL PANEL</span>
          </div>

          <div className={CLASSES.CMS_USER_INFO}>
            {this.user?.photoURL ? (
              <img
                src={this.user.photoURL}
                alt="Avatar"
                className={CLASSES.CMS_AVATAR}
              />
            ) : null}
            <span className={CLASSES.CMS_EMAIL}>
              {this.user?.email || 'Admin User'}
            </span>
            <button className={CLASSES.CMS_LOGOUT_BTN} type="button">
              Logout
            </button>
          </div>
        </header>

        <nav className={CLASSES.CMS_NAV_TABS}>
          <button
            className={`${CLASSES.CMS_TAB_BTN} ${this.activeTab === 'portfolio' ? 'active' : ''}`}
            data-tab="portfolio"
            type="button"
          >
            🖼️ Homepage &amp; Portfolio
          </button>
          <button
            className={`${CLASSES.CMS_TAB_BTN} ${this.activeTab === 'projects' ? 'active' : ''}`}
            data-tab="projects"
            type="button"
          >
            📁 Project Case Studies
          </button>
          <button
            className={`${CLASSES.CMS_TAB_BTN} ${this.activeTab === 'about' ? 'active' : ''}`}
            data-tab="about"
            type="button"
          >
            👤 About &amp; Gravatar
          </button>
          <button
            className={`${CLASSES.CMS_TAB_BTN} ${this.activeTab === 'footer' ? 'active' : ''}`}
            data-tab="footer"
            type="button"
          >
            🦶 Footers &amp; Contact
          </button>
          <button
            className={`${CLASSES.CMS_TAB_BTN} ${this.activeTab === 'languages' ? 'active' : ''}`}
            data-tab="languages"
            type="button"
          >
            🌐 Language Dictionary &amp; Keys
          </button>
        </nav>

        <main className={CLASSES.CMS_MAIN_CONTENT}>
          {this.renderTabComponent()}
        </main>

        <div
          className={CLASSES.CMS_TOAST}
          style={{ display: this.toastMessage ? 'flex' : 'none' }}
        >
          <span>✨</span>
          <span className={CLASSES.TOAST_TEXT}>{this.toastMessage}</span>
        </div>
      </div>
    )
  }
}

if (!customElements.get(TAGS.VIEW_CMS_DASHBOARD)) {
  customElements.define(TAGS.VIEW_CMS_DASHBOARD, ViewCmsDashboard)
}
