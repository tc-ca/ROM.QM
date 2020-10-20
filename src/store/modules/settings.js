
export const state = {
  app: {
    settings: {

    }
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
    state.app.settings.darkMode = val
  },

  SET_LANGUAGE (state, val) {
    state.app.settings.lang = val
  },
  SET_SETTINGS (state, val) {
    state.app.settings = val
  }
}

export const getters = {
  getSettings (state) {
    // TODO: pull settings form server
    return state.app.settings
  }
}

const saveSettingToLocalStore = (app) => {
  if (localStorage) {
    localStorage.appSettings = JSON.stringify(app)
  }
}
