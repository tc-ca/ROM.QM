import Vue from 'vue'
import Router from 'vue-router'
import PageNotFound from '@/views/page-not-found'
import Home from '@/views/home.vue'
import Questionnaire from '@/views/questionnaire.vue'
import Builder from '@/views/builder.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: Questionnaire
  },
  {
    name: 'builder',
    path: '/builder',
    components: {
      default: Builder
    }// ,
    // props: {
    //   default: true,
    //   settings: {},
    //   templatejson: 'Default Questionnaire'
    // }
  },
  {
    path: '*',
    component: PageNotFound
  }]
})
