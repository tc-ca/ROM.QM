import legislationLocalCopy from '../../api/legislation.json'

const env = process.env.NODE_ENV || "development";

export const state = {
         legislations: env === "development" ? legislationLocalCopy: null 
       };


export const actions = {
  // SetLegislationsState({ commit }, payload) {
  // }
};

export const mutations = {
  SetLegislations(state, payload) {
    state.legislations = payload;
  }
};
