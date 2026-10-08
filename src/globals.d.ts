/**
 * @file globals.d.ts
 * @description Global ambient declarations for the project —
 * JSX runtime typing for `h`/`Fragment` (classic pragma), virtual Vite
 * modules, `?inline` stylesheet imports, asset imports and the
 * HTMLElementTagNameMap extensions for the site's custom elements.
 */

// ─── JSX runtime (classic pragma: h / Fragment) ─────────────────────────────

/** Props accepted by any element: arbitrary DOM attrs, listeners, refs. */
interface JSXProps {
  [key: string]: unknown
  className?: string
  class?: string
  style?: string | Partial<CSSStyleDeclaration> | Record<string, string>
  ref?: (_el: HTMLElement | SVGElement | null) => void
  dangerouslySetInnerHTML?: { __html: string }
}

declare global {
  namespace JSX {
    type Element = HTMLElement | SVGElement | DocumentFragment
    type ElementChildrenAttribute = { children: unknown }
    interface IntrinsicElements {
      [elemName: string]: JSXProps
    }
    interface IntrinsicAttributes {
      key?: string | number
    }
    interface ElementClass {
      render(): unknown
    }
  }
}

export {}

// ─── Custom elements registered by the component layer ──────────────────────

declare global {
  interface Window {
    router?: import('@core/router/router.js').Router
  }

  interface HTMLElementTagNameMap {
    'app-nav': HTMLElement
    'home-mosaic': HTMLElement
    'awards-carousel': HTMLElement
    'custom-carousel': HTMLElement
    'media-figure': HTMLElement
    'media-expanded': HTMLElement
    'draw-text': HTMLElement
    'portfolio-related': HTMLElement
    'about-section': HTMLElement
    'contact-section': HTMLElement
    'awards-mentions': HTMLElement
    'site-toast': HTMLElement
    'preferences-modal': HTMLElement
    'lang-dialog': HTMLElement
    'expand-modal': HTMLElement
    'internal-footer': HTMLElement
    'view-admin-login': HTMLElement
    'view-cms-dashboard': HTMLElement
    'cms-portfolio-list': HTMLElement
    'cms-projects-list': HTMLElement
    'cms-about-editor': HTMLElement
    'cms-footer-editor': HTMLElement
    'cms-lang-editor': HTMLElement
    'cms-playground-editor': HTMLElement
    'cms-media-converter': HTMLElement
    'cms-deploy-info': HTMLElement
  }
}

export {}
