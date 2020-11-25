
export const state = {
  legislations: null
};


export const actions = {
  SetLegislationsState({ commit }, payload) {
  }
};

export const mutations = {
  SetLegislations(state, payload) {
    state.legislations = payload;
  }
};
