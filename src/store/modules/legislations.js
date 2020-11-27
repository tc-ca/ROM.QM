export const state = {
  legislations: null
};

export const getters = {
  GetLegislationFromLocalData(state) {
    return state.legislations;
  },
  NeedToLoadLegislations(state) {
    return state.legislations === null;
  }
};

export const actions = {
  async SetLegislationsStateToLocalData({ commit }) {
    const data = await GetLegislationFromLocalImportModule();
    commit("SetLegislations", data);
  },
  async SetLegislationsState({ commit }, payload) {
    //////////////////////
    /////legislations is the name of the property on payload
    const { legislations } = payload
    commit("SetLegislations", legislations);
  }
};

export const mutations = {
  SetLegislations(state, payload) {
    state.legislations = payload;
  }
};

async function GetLegislationFromLocalImportModule() {
  //TODO 
  //legislationDictionnary = render
  //legislation = builder
  const data = await import("../../api/legislationDictionnary").then(module => {
    return module.default;
  });
  return data;
}