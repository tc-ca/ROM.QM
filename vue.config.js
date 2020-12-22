module.exports = {

  'transpileDependencies': [
    'vuetify'
  ],

  runtimeCompiler: true,

  filenameHashing: false,

  // speeds up build for production. Set to true if we need debug information
  productionSourceMap: false,

  publicPath: '',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },

  configureWebpack: {

    entry: {
      app: './src/main.js'
    },

    performance: {
      hints: false
    },


    output: {
      filename: "./js/[name].js",
      chunkFilename: "./js/[name].js"
    },

    optimization: {
      splitChunks:{
        chunks: "all",
        name: true,
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'all',
            minChunks: 1
          }
        },
        maxSize: 0,
        minChunks: 1,
        minSize: 0
      } 
    }
  },

  chainWebpack: (config) => {
    config.plugin("copy").tap(([options]) => {
      options[0].ignore.push("static/**");
      return [options];
    });
  },
}