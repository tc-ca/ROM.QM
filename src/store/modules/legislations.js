
export const state = {
  legislations: null
};

export const actions = {
  // SetLegislationsState({ commit }, payload) {
  // }
    async SetLegislationsStateToLocalData({ commit }) {
      const data = await GetLegislationFromLocalImportModule();
      commit("SetLegislations", data);
  }
};

export const mutations = {
  SetLegislations(state, payload) {
    state.legislations = payload;
  }
};

async function GetLegislationFromLocalImportModule() {
  const data = await import("../../api/legislation").then(module => {
    return module.default;
  });
  return data;
}
