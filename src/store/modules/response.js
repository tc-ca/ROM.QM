
export const state = {
  responses: { templateId: '', groups: [] }
}
export const getters = {
  getAllResponsesForGroup (state, getters) {
    return (htmlElementId) => {
      const group = getters.getGroupByHtmlElementId(htmlElementId)

      // if group does not exist return empty array as responses are always an array type
      let responses = []
      if (group === undefined) {
        return responses
      }
      // gets all responses for each question within group
      group.questions.forEach(question => {
        question.responses.forEach(response => {
          responses.push(response)
        })
      })
      return responses
    }
  },

  getGroupByHtmlElementId (state) {
    return (htmlElementId) => {
      return state.responses.groups.find(x => x.htmlElementId === htmlElementId)
    }
  },

  getResponsesToShowInGroupHeader (state, getters, rootState) {
    return (htmlElementId) => {
      const responses = getters.getAllResponsesForGroup(htmlElementId)
      const result = responses.filter(response => response.displayInGroupHeader)
      return result.map(response => response.displayText[rootState.app.settings.lang])
    }
  }

}

function addResponsesToWindowObject (responses) {
  // eslint-disable-next-line no-undef
  window.TCQuestionnaireBuilder = { responses: responses }
}

export const actions = {
  updateResponseStore  (context, payload) {
    const { group, question, answers } = payload

    // check if the response group exist, htmlElementId would be unique versus primary key i.e. the group can be repeated
    const responseGroup = context.state.responses.groups.find(x => x.htmlElementId === group.htmlElementId)

    let questionIndex = -1

    // add group to the response store if the specify one does exist.
    if (typeof responseGroup === 'undefined') {
      context.commit('addGroupToResponseStore', { group })
    } else {
    // if the group exist, check to see if response exist
    // TODO: add below conditional statement
    // TODO: add field on the question entity to drive how many responses are allowed.
    // if (x.primaryKey === question.primaryKey && x.response === response.primaryKey) {
      questionIndex = responseGroup.questions.findIndex(x => x.htmlElementId === question.htmlElementId)
    }

    // get the group index to add the question response to the right group
    const groupIndex = context.state.responses.groups.findIndex(x => x.htmlElementId === group.htmlElementId)

    if (questionIndex === -1) {
      context.commit('addResponse', { groupIndex, question, answers })
    } else {
      context.commit('updateResponse', { groupIndex, questionIndex, answers })
    }
    // if group is repeatable
    // check group title identifer prop
    // put name and text value in the response store
    // so we could search on name
  },

  updateSupplementaryInfo  (context, payload) {
    const { group, question, response, saveToProp } = payload
    const responseGroup = context.state.responses.groups.find(x => x.htmlElementId === group.htmlElementId)
    // question index should always exist in this case as a response must be answered before supplementary info provided,
    // therefore question obj should always be found in the response store
    // TODO add error/log handling when returning -1 from findIndex.

    const questionIndex = responseGroup.questions.findIndex(x => x.htmlElementId === question.htmlElementId)

    context.commit('updateSupplementaryInfo', { responseGroup, questionIndex, response, saveToProp })
  }

}

export const mutations = {

  addResponse (state, payload) {
    const { groupIndex, question, answers } = payload
    state.responses.groups[groupIndex].questions.push({ primaryKey: question.primaryKey, htmlElementId: question.htmlElementId, responses: answers })
    addResponsesToWindowObject(state.responses)
  },

  updateResponse (state, payload) {
    const { groupIndex, questionIndex, answers } = payload
    state.responses.groups[groupIndex].questions[questionIndex].responses = answers
    addResponsesToWindowObject(state.responses)
  },

  addGroupToResponseStore (state, payload) {
    const { group } = payload
    state.responses.groups.push({ primaryKey: group.primaryKey, htmlElementId: group.htmlElementId, order: group.order, questions: [] })
    addResponsesToWindowObject(state.responses)
  },

  updateSupplementaryInfo (state, payload) {
    const { responseGroup, questionIndex, response, saveToProp } = payload
    responseGroup.questions[questionIndex][saveToProp] = response
    addResponsesToWindowObject(state.responses)
  }

}
