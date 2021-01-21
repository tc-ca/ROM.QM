export const state = {
  characteristics: null,
  siteCharacteristics: null
};

export const getters = {};

export const actions = {
  // load local data in public folders
  async SetCharacteristicsStateToLocalData({ commit }) {
    const data = await GetCharacteristicsFromLocalImportModule();
    commit("SET_CHARACTERISTICS", {
      data
    });
  },

  //loads data pass into vue instance
  async SetCharacteristicsState({ commit }, payload) {
    commit("SET_CHARACTERISTICS",
      payload
    );
  }
};

export const mutations = {
  SET_CHARACTERISTICS(state, payload) {
    const { data } = payload;
    state.characteristics = data.characteristics;
    state.siteCharacteristics = data.siteCharacteristics;
  }
};

async function GetCharacteristicsFromLocalImportModule() {
  const axios = await import("axios");

  let response = await axios
    .get("/static/characteristics.json")
    .catch(function(error) {
      // handle error
      console.log(error);
    });

  console.log(response);

  return response.data;
}
