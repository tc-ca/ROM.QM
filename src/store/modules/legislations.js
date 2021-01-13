export const state = {
  legislations: null,
  dataStructure: null
};

export const getters = {

};

export const actions = {
  // load local data in public folders
  async SetTreeLegislationsStateToLocalData({ commit }) {
    const data = await GetTreeLegislationFromLocalImportModule();
    commit("setTreeLegislations", {legislations: data, dataStructure: 'tree'});
  },
    async SetFlatLegislationsStateToLocalData({ commit }) {
    const data = await GetFlatLegislationFromLocalImportModule();
    commit("setFlatLegislations", {legislations: data, dataStructure: 'flat'});
  },

  //loads data pass into vue instance
  async SetTreeLegislationsState({ commit }, payload) {
    const { legislations } = payload
    commit("setTreeLegislations", { legislations, dataStructure: "flat" });
  },
    async SetFlatLegislationsState({ commit }, payload) {
    const { legislations } = payload
    commit("setFlatLegislations", {legislations, dataStructure: 'flat'});
  }
};

export const mutations = {
  setTreeLegislations(state, payload) {
    const {legislations, dataStructure} = payload
    state.legislations = legislations;
    state.dataStructure = dataStructure
  },
    setFlatLegislations(state, payload) {
     const { legislations, dataStructure } = payload;
     state.legislations = legislations;
     state.dataStructure = dataStructure;
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