
export const state = {
  // tracks dynamic questions for special cases, where no response is passed into the showOrHideQuestion method, knowing the question we can hide the previously made visible question.
  // i.e. de-selecting select control option returns no responses, but the response question is known and we could hide any questions made visible by the question
  // note: ideally instead filtering off question we could TODO: fill in the blank here (forget at the moment)
  questionsDynamicShowReference: []
}

/**
* gets the questions out of groups into a flat structure
*/
export const getters = {
  questionnaireQuestions (state, getters, rootState, rootGetters) {
    let questions = []
    const groups = rootState.group.groups
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      for (let questionIndex = 0; questionIndex < groups[groupIndex].questions.length; questionIndex++) {
        questions.push(groups[groupIndex].questions[questionIndex])
      }
    }
    return questions
  }
}

export const actions = {
  updateQuestionHtmlElementId ({ commit }, payload) {
    const { question, group } = payload

    // question element id is prefix  with #001 if, in repeated group its prefix should match that of the group prefix
    // i.e. group_1#-002 --> question_1#002
    const newHtmlElementId = `${question.primaryKey}${group.domSuffix}`

    commit('updateQuestionHtmlElementId', { question, newHtmlElementId })
  },
  // TODO: if question triggers itself dont register
  /**
  * Note must pass in entire response object.
  */
  showOrHideQuestion ({ state, commit, getters }, payload) {
    const { question, responses } = payload
    const questions = getters.questionnaireQuestions

    // de-selecting all options in multi select returns no responses
    if (responses.length === 0) {
      // check to see if the emitting response triggered a subsequent question and then hide the questions if that is the case
      const targetedEmittedSourceQuestions = state.questionsDynamicShowReference.filter(x => x.emittingSource.question.htmlElementId === question.htmlElementId)

      for (let index = 0; index < targetedEmittedSourceQuestions.length; index++) {
        for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
          // hide the question that was made visible/triggered by another question
          if (questions[questionIndex].htmlElementId === targetedEmittedSourceQuestions[index].madeVisibleQuestion.htmlElementId) {
            commit('hideQuestion', { question: questions[questionIndex] })
          }
        }
      }
      commit('unTrackDynamicQuestion', { emittingSource: { question: question } })
    } else {
      for (let responseIndex = 0; responseIndex < responses.length; responseIndex++) {
        for (let questionIndex2 = 0; questionIndex2 < questions.length; questionIndex2++) {
          let emitValue = responses[responseIndex].emitValue
          let responseHtmlElementId = responses[responseIndex].primaryKey
          let showKey = questions[questionIndex2].showKey
          let hideKey = questions[questionIndex2].hideKey

          if ((typeof emitValue !== 'undefined' && emitValue !== null) && (typeof showKey !== 'undefined' && showKey !== null)) {
            if (emitValue === showKey) {
              // to be read like emitting source x made visible question y
              commit('trackDynamicQuestion', { emittingSource: { question: question, response: responseHtmlElementId }, madeVisibleQuestion: { htmlElementId: questions[questionIndex2].htmlElementId } })
              commit('showQuestion', { question: questions[questionIndex2] })
            } else if (emitValue === hideKey) {
              commit('unTrackDynamicQuestion', { emittingSource: { question: question } })
              commit('hideQuestion', { question: questions[questionIndex2] })
            }
          }
        }
      }
    }
  }
}

export const mutations = {
  updateQuestionHtmlElementId (state, payload) {
    const { question, newHtmlElementId } = payload
    question.htmlElementId = newHtmlElementId
  },
  hideQuestion (state, payload) {
    const { question } = payload
    question.isVisible = false
  },

  showQuestion (state, payload) {
    const { question } = payload
    question.isVisible = true
  },

  trackDynamicQuestion (state, payload) {
    state.questionsDynamicShowReference.push(payload)
  },

  // Any question attached to the emitting source will be removed.
  unTrackDynamicQuestion (state, payload) {
    const { emittingSource } = payload
    for (let index = state.questionsDynamicShowReference.length - 1; index >= 0; index--) {
      if (state.questionsDynamicShowReference[index].emittingSource.question.htmlElementId === emittingSource.question.htmlElementId) {
        state.questionsDynamicShowReference.splice(index, 1)
      }
    }
  }
}
