export const state = {
  settings: {
    lang: 'en-US',
    darkMode: false
  }
}

export const actions = {

  saveDarkMode ({ commit }, val) {
    val = !!val
    // TODO: save to storage
    commit('SET_DARKMODE', val)
    saveSettingToLocalStore(state.app)
  },

  setAppLanguage ({ commit }, val) {
    commit('SET_LANGUAGE', val)
    saveSettingToLocalStore(state.app)
  },

  setSettings ({ commit }, val) {
    commit('SET_SETTINGS', val)
    saveSettingToLocalStore(state.app)
  }
}

export const mutations = {

  SET_DARKMODE (state, val) {
    state.settings.darkMode = val
  },

  SET_LANGUAGE (state, val) {
    state.settings.lang = val
  },
  SET_SETTINGS (state, val) {
    state.settings = val
  }
}

export const getters = {
  getAppSettings (state) {
    // TODO: pull settings form server
    return state.settings
  }
}

const saveSettingToLocalStore = (app) => {
  if (localStorage) {
    localStorage.appSettings = JSON.stringify(app)
  }
}
