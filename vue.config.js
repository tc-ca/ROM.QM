module.exports = {
  filenameHashing: false,

  // speeds up build for production. Set to true if we need debug information
  productionSourceMap: false,

  'transpileDependencies': [
    'vuetify'
  ],

  publicPath: '',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
