// function IsFieldDisplayed (optionSetValue) {
//   return !!((optionSetValue === FIELD_REQUIREMENT.OPTIONAL || optionSetValue === FIELD_REQUIREMENT.REQUIRED))
// }

// function IsFieldRequired (optionSetValue) {
//   return (optionSetValue === FIELD_REQUIREMENT.REQUIRED)
// }

// function IsProblem (optionSetValue) {
//   return (optionSetValue === PROBLEM_TYPE.PROBLEM_YES)
// }

export default {

  GetQuestionnaireGroups () {
    let questionnaire = require('../api/safety-marks-and-documentation.js').default

    let questionDict = {}

    let populateQuestons = (queston) => {
      questionDict[queston.id] = queston

      queston.childQuestions.forEach(child => {
        populateQuestons(child)
      })
    }

    questionnaire.groups.forEach(qroup => {
      if (qroup.question) {
        qroup.qustions.forEach(q => populateQuestons(q))
      }
    })

    let populateDependantsOnQuestions = (question) => {
      question.dependencyGroups.forEach(dg => {
        dg.questionDependencies.forEach(qd => {
          qd.dependsOnQuestion = questionDict[qd.dependsOnQuestion]
        })
      })

      question.childQuestions.forEach(cq => this.populateDependantsOnDependency(cq))
    }

    questionnaire.groups.forEach(qroup => {
      if (qroup.question) {
        qroup.qustions.forEach(q => populateDependantsOnQuestions(q))
      }
    })

    return questionnaire
  }

}
