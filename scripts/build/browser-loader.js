/**
 * @file browser-loader.js
 * @description Runtime bundle dispatcher, inlined into dist/index.html by
 * scripts/build-targets.mjs. Written in strict ES5 — it must parse on the
 * oldest engines it detects (including IE-era parsers).
 *
 * Boot sequence:
 *   1. Feature ladder — walks build/es-targets.mjs tests newest→oldest.
 *      Module builds additionally require `type=module` AND dynamic import()
 *      support; engines missing either fall to the es2016 IIFE bundle.
 *   2. Polyfill gates — each polyfill group is fetched ONLY when its guard
 *      API is actually missing. Modern browsers fetch zero polyfills.
 *   3. Tier assets — injects the tier's stylesheet, then the bundle
 *      (type=module or classic IIFE) once polyfills have executed.
 *
 * window.__LK is the injected manifest:
 *   { targets: [{name, js, css, module, tests:[str]}],
 *     polys:   [{name, file, guard}],
 *     order:   [poly names in load order] }
 */
;(function () {
  'use strict'

  var LK = window.__LK
  if (!LK || !LK.targets || !LK.targets.length) return

  /** Evaluates a feature probe; a thrown parse/runtime error = unsupported. */
  function probe(code) {
    try {
      return !!new Function('return (' + code + ')')()
    } catch {
      return false
    }
  }

  /** Native ES module support (IE/EdgeHTML and pre-Chrome-61 lack it). */
  function supportsModule() {
    return 'noModule' in document.createElement('script')
  }

  /** Dynamic import() — Safari ≤11.0 / Edge ≤18 have modules but no import().
   *  Compile-only probe: executing the import could hit CSP script-src, so we
   *  only check that the syntax parses. */
  function supportsImport() {
    try {
      new Function('return import("x")')
      return true
    } catch {
      return false
    }
  }

  /**
   * UA identification — the manifest's `browsers` list is ordered
   * most-specific-first (Samsung Internet / Edge / Opera all claim Chrome;
   * every modern UA claims Safari). Result is exposed to the app as
   * `window.__LK_BROWSER` and to stylesheets as `data-browser` /
   * `data-browser-major` on <html> so engine quirks never get re-sniffed.
   */
  function detectBrowser() {
    var ua = (navigator && navigator.userAgent) || ''
    var specs = LK.browsers || []
    var i, m

    for (i = 0; i < specs.length; i++) {
      m = ua.match(new RegExp(specs[i].pattern))
      if (m)
        return {
          name: specs[i].name,
          major: parseInt(m[1], 10) || 0,
          quirks: specs[i].quirks || {},
        }
    }

    return { name: 'other', major: 0, quirks: {} }
  }

  /**
   * Applies the detected engine's quirks: datasets for CSS hooks plus the
   * `__LK_BROWSER` hint bag the runtime consults (webgpu:false skips a
   * doomed WebGPU init, lowGpu lets renderers start at reduced scale).
   */
  function applyBrowserHints() {
    var b = detectBrowser()
    var html = document.documentElement

    if (html && html.setAttribute) {
      html.setAttribute('data-browser', b.name)
      html.setAttribute('data-browser-major', String(b.major))
    }

    var hints = { name: b.name, major: b.major }
    var q = b.quirks
    var k

    for (k in q) if (Object.prototype.hasOwnProperty.call(q, k)) hints[k] = q[k]

    window.__LK_BROWSER = hints
  }

  /** Picks the newest tier whose probes all pass. */
  function pickTier() {
    var canModule = supportsModule()
    var canImport = canModule && supportsImport()
    var i, j, t, ok
    for (i = 0; i < LK.targets.length; i++) {
      t = LK.targets[i]
      if (t.module && !canImport) continue
      ok = true
      for (j = 0; j < t.tests.length; j++) {
        if (!probe(t.tests[j])) {
          ok = false
          break
        }
      }
      if (ok) return t
    }
    return null
  }

  /** Collects polyfills whose guard APIs are missing, in declared order. */
  function neededPolyfills() {
    var missing = {}
    var out = []
    var i
    for (i = 0; i < LK.polys.length; i++) {
      missing[LK.polys[i].name] = !probe(LK.polys[i].guard)
    }
    for (i = 0; i < LK.order.length; i++) {
      var name = LK.order[i]
      if (missing[name]) {
        for (var j = 0; j < LK.polys.length; j++) {
          if (LK.polys[j].name === name) out.push(LK.polys[j].file)
        }
      }
    }
    return out
  }

  /** Injects a classic script; calls back when it has executed. */
  function loadScript(src, done) {
    var s = document.createElement('script')
    s.src = src
    s.async = false
    s.onload = function () {
      done()
    }
    s.onerror = function () {
      done()
    }
    document.head.appendChild(s)
  }

  /** Chains polyfill scripts so each executes before the next is fetched. */
  function loadPolyfills(files, done) {
    if (!files.length) {
      done()
      return
    }
    loadScript(files[0], function () {
      loadPolyfills(files.slice(1), done)
    })
  }

  /** Appends the tier stylesheet to <head>. */
  function injectCss(href) {
    var l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = href
    document.head.appendChild(l)
  }

  /** Graceful notice for engines below every tier (e.g. IE11). */
  function showFallback() {
    var box = document.createElement('div')
    box.setAttribute(
      'style',
      'font-family:sans-serif;max-width:32em;margin:20vh auto;padding:1em;text-align:center'
    )
    box.innerHTML =
      '<h1>Luis Krötz</h1><p>This site needs a newer browser — please update Chrome, Edge, Firefox or Safari.</p>'
    var app = document.getElementById('app') || document.body || document.documentElement
    app.appendChild(box)
  }

  /** Boots the selected tier after its polyfills have executed. */
  function boot(tier) {
    // The default tier's stylesheet is already in <head> (static lazy-load);
    // older tiers need theirs injected (and it wins the cascade by order).
    if (!tier.default) injectCss(tier.css)
    var s = document.createElement('script')
    if (tier.module) {
      s.type = 'module'
      s.src = tier.js
    } else {
      s.src = tier.js
      s.defer = false
    }
    // This loader runs inside <head> during parsing — document.body does not
    // exist yet. Appending to <head> is equivalent for execution (module
    // scripts defer anyway, classic scripts run on load).
    document.head.appendChild(s)
  }

  applyBrowserHints()

  var tier = pickTier()
  if (!tier) {
    showFallback()
    return
  }
  loadPolyfills(neededPolyfills(), function () {
    boot(tier)
  })
})()
