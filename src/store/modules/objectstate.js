export const namespaced = true

export const state = {
    data: {
        questionnaire: Object,
    }
}

export const getters = {
    
}

export const actions = {
    UpdateQuestionnaireState({commit}, payload) {
    commit("updateQuestionnaireState", payload);
  },
}

export const mutations = {
    updateQuestionnaireState (state, payload) {
        state.data.questionnaire = [payload]
    }
}

