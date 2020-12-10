export const namespaced = true

export const state = {
    questionnaire: {
        oldQuestionnaire: Object,
        newQuestionnaire: Object
    }
}

export const getters = {
    questionId: state => {
        return state.errorNotification.qid
    }
}

export const actions = {
  
}

export const mutations = {
    updateOldQuestionnaireState (state, payload) {
        state.questionnaire.oldQuestionnaire = payload
    },
    updateNewQuestionnaireState (state, payload) {
        state.questionnaire.newQuestionnaire = payload
    }
}

