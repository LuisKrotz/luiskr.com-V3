// https://cli.vuejs.org/core-plugins/pwa.html#configuration
// https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

module.exports = {
    pwa: {
        name: 'Luis Krötz',
        themeColor: '#FFF',
        msTileColor: '#262626',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black-translucent',
        manifestPath: 'site.webmanifest',
        iconPaths: {
            faviconSVG: 'favicon.svg',
            favicon32: 'favicon-32x32.png',
            favicon16: 'favicon-16x16.png',
            appleTouchIcon: 'apple-touch-icon.png',
            maskIcon: 'safari-pinned-tab.svg',
            msTileImage: 'mstile-150x150.png'
        },
        manifestOptions: {
            name: "Luis Krötz",
            short_name: "Luis Krötz",
            start_url: 'https://luiskr.com',
            display: "fullscreen",
            theme_color: "#262626",
            background_color: "#FFF",
            icons: [
              {
                src: "favicon.svg",
                sizes: "512x512",
                type: "image/svg+xml",
                purpose: "any maskable",
              },
            ],
          },
        // configure the workbox plugin
        workboxPluginMode: 'GenerateSW'
      }
}