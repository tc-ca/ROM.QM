import Vue from 'vue'
import App from './App.vue'
import store from './store/store.js'
import vuetify from './plugins/vuetify'
import router from './router'

// Custom elements polyfill'
import 'document-register-element/build/document-register-element'

import vueCustomElement from 'vue-custom-element'
import '@/assets/css/global.css'

import i18n from './i18n'

Vue.use(vueCustomElement)

Vue.config.productionTip = false

App.store = store
App.vuetify = vuetify
App.i18n = i18n
App.router = router

Vue.customElement('questionnaire-builder', App)

// new Vue({
//   store,
//   vuetify,
//   i18n,
//   render: h => h(App)
// }).$mount('#app')
