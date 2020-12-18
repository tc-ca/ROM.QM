export const state = {
  legislations: null
};

export const getters = {

};

export const actions = {
  async SetTreeLegislationsStateToLocalData({ commit }) {
    const data = await GetTreeLegislationFromLocalImportModule();
    commit("SetLegislations", data);
  },
    async SetFlatLegislationsStateToLocalData({ commit }) {
    const data = await GetFlatLegislationFromLocalImportModule();
    commit("SetLegislations", data);
  },
  async SetLegislationsState({ commit }, payload) {
    const { legislations } = payload
    commit("SetLegislations", legislations);
  }
};

export const mutations = {
  SetLegislations(state, payload) {
    state.legislations = payload;
  }
};

async function GetTreeLegislationFromLocalImportModule() {
  //TODO 
  //legislationDictionnary = render
  //legislation = builder
  const axios = await import('axios')

  let response = await axios.get('/static/legislation.json')
    .catch(function (error) {
      // handle error
      console.log(error)
    })

  console.log(response)

  return response.data;
}

async function GetFlatLegislationFromLocalImportModule() {
  //TODO
  //legislationDictionnary = render
  //legislation = builder
  const axios = await import('axios')

  let response = await axios.get('/static/legislationDictionnary.json')
    .catch(function (error) {
      // handle error
      console.log(error)
    })

  console.log(response)

  return response.data;
}