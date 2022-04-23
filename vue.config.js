// https://cli.vuejs.org/core-plugins/pwa.html#configuration
// https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */

const path = 'https://luiskr.com/';

module.exports = {
    pwa: {
        name: 'Luis Krötz',
        themeColor: '#FFF',
        msTileColor: '#262626',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black-translucent',
        manifestPath: path + 'site.webmanifest',
        iconPaths: {
            faviconSVG: path + 'favicon.svg',
            favicon32: path + 'favicon-32x32.png',
            favicon16: path + 'favicon-16x16.png',
            appleTouchIcon: path + 'apple-touch-icon.png',
            maskIcon: path + 'safari-pinned-tab.svg',
            msTileImage: path + 'mstile-150x150.png'
        },
        manifestOptions: {
            name: "Luis Krötz",
            short_name: "Luis Krötz",
            start_url: path,
            display: "fullscreen",
            theme_color: "#262626",
            background_color: "#FFF",
            icons: [
              {
                src: path + "favicon.svg",
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