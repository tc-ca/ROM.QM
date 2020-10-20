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
      locale: 'en-US',
      fallbackLocale: 'en-US',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
