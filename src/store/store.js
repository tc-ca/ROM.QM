import Vue from 'vue'
import Vuex from 'vuex'
import * as group from '@/store/modules/group.js'
import * as notification from '@/store/modules/notification.js'
import * as settings from '@/store/modules/settings.js'
import * as questionnaire from '@/store/modules/questionnaire.js'

Vue.use(Vuex)

/**
 * Actions, Mutations, and Getters are always registered under the global namespace (a.k.a the root which is $store) even when using Modules.
 * i.e. called without module name.
 *
*/
export default new Vuex.Store({
  modules: {
    group,
    notification,
    settings,
    questionnaire
  },

  state: {
  },

  getters: {
  },

  /**
     * Actions can be complex but never update the state
     *
     */
  actions: {
  },

  /**
     * Mutations should responsible for updating a single piece of the state
     * Should not be called from other Vuex Modules
     * Mutations should  only be called from Actions inside the current Module.
     * Vuex will automatically pass in the state as the first parameter and we can pass additional parameter called the payload
     * Mutations should not
     * Fetch data
     * Make complex calculations
     */
  mutations: {
  }
})
