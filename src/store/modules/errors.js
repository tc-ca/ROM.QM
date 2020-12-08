export const namespaced = true

export const state = {
    errorNotification: {
        qid: String
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
    updateErrorNotification (state, payload) {
        state.errorNotification.qid = payload
    }
}

