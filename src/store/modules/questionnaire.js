import _ from 'lodash'

export const state = {
  groups: [],
  groupsCopy: [],
  questionnaire: {}
}
export const actions = {
  save ({ dispatch }, questionnaire) {
    // first save to state for use in questionnaire
    let groups = _.cloneDeep(questionnaire.groups)

    let populateDependantsOnDependency = (q) => {
      q.dependencyGroups.forEach(dg => {
        dg.questionDependencies.forEach(qd => qd.dependsOnQuestion.dependants.push(q))
      })
      q.childQuestions.forEach(cq => populateDependantsOnDependency(cq))
    }

    groups.forEach(g => {
      g.questions.forEach(q => {
        populateDependantsOnDependency(q)
      })
    })
    dispatch('setQuestionnaireGroups', groups)
    state.questionnaire = questionnaire

    // then serialize for saving
    questionnaire = _.cloneDeep(questionnaire)

    let populateDependantsOnDependencyIds = (q) => {
      q.dependencyGroups.forEach(dg => {
        dg.questionDependencies.forEach(qd => qd.dependsOnQuestion.dependants.push(q.id))
      })
      q.childQuestions.forEach(cq => populateDependantsOnDependencyIds(cq))
    }

    questionnaire.groups.forEach(g => {
      g.questions.forEach(q => {
        populateDependantsOnDependencyIds(q)
      })
    })

    let removeCircularRefFromDependency = (question) => {
      question.dependencyGroups.forEach(dg => {
        dg.questionDependencies.forEach(qd => { qd.dependsOnQuestion = qd.dependsOnQuestion.id })
      })

      question.childQuestions.forEach(cq => removeCircularRefFromDependency(cq))
    }

    questionnaire.groups.forEach(g => {
      g.questions.forEach(q => {
        removeCircularRefFromDependency(q)
      })
    })

    console.log(JSON.stringify(questionnaire, null, 2))
  }
}

export const mutations = {
  setQuestionnaire (state, payload) {
    const { questionnaire } = payload
    state.questionnaire = questionnaire
  }
}
