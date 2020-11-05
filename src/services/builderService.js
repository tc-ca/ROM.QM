import { LANGUAGE } from '../constants.js'

function createGroup (questionnaire) {
  let group = {}
  const id = getNextGroupId(questionnaire);

  group.primaryKey = `Group ${id + 1}`;
  group.title = {
    [LANGUAGE.ENGLISH]: 'New Group',
    [LANGUAGE.FRENCH]: 'Fr: New Group'
  }
  group.isRepeatable = false
  group.isVisible = true
  group.showKey = ''
  group.hideKey = ''
  group.order = id
  group.domSuffix = 'prop value created virtually'
  group.htmlElementId = 'prop value created virtually'

  group.questions = []

  return group
}

function createQuestionnaire () {
  return {
    name: 'Questionnaire 1',
    title: {
      [LANGUAGE.ENGLISH]: 'Questionnaire Title EN',
      [LANGUAGE.FRENCH]: 'Questionnaire Title EN'
    },
    groups: []
  }
}

function createQuestion (questionnaire) {
  let id = getNextQuestionId(questionnaire)
  let question = {
    name: 'Question',
    id: id,
    sortOrder: id,
    isVisible: true,
    isMultiple: true,
    text: {
      [LANGUAGE.ENGLISH]: 'Question text',
      [LANGUAGE.FRENCH]: 'FR: Question text'
    },
    type: 'radio', // text, number, select, radio, boolean, image...
    response: null,
    responseOptions: [
      {
        id: 1,
        sortOrder: 1,
        text: {
          [LANGUAGE.ENGLISH]: 'Yes',
          [LANGUAGE.FRENCH]: 'FR: Yes'
        },
        value: 'true'
      // ...
      },
      {
        id: 2,
        sortOrder: 2,
        text: {
          [LANGUAGE.ENGLISH]: 'No',
          [LANGUAGE.FRENCH]: 'FR: No'
        },
        value: 'false'
      }
    ],
    validationRules: [
      {
        name: 'require', // use it as a reference for parent question to enable/disable validator
        enabled: true,
        type: 'require', // min, max....
        value: null,
        errorMessage: {
          [LANGUAGE.ENGLISH]: 'Required',
          [LANGUAGE.FRENCH]: 'FR: Required'
        }
      }
    ],
    violationInfo: {
      responseToMatch: 'false', // value to compare to question.response. If matches then supplementaryInfo rule is applied
      matchingType: 'equal' // notEqual, greaterThen, lessThen...
    },
    internalComment: {
      option: '2', value: ''
    },
    externalComment: {
      option: '2', value: ''
    },
    picture: {
      option: '2', value: ''
    },
    childQuestions: [

    ],
    dependants: [],
    dependencyGroups: []
  }

  question.name = 'Question ' + id

  return question
}

function createChildQuestion (questionnaire, queistion) {
  let q = createQuestion(questionnaire)
  q.sortOrder = queistion.childQuestions.length + 1
  return q
}

function getNextGroupId (questionnaire) {
  return questionnaire.groups.length
}

function getNextQuestionId (questionnaire) {
  let length = 0
  questionnaire.groups.forEach(group => {
    length += getTotalQuestionsNumber(group.questions)
  })

  return length + 1
}

function getTotalQuestionsNumber (questions) {
  let length = 0
  length += questions.length

  questions.forEach(q => {
    length += getTotalQuestionsNumber(q.childQuestions)
  })
  return length
}

function createResponseOption (question) {
  let id = question.responseOptions.length + 1
  return {
    id: id,
    sortOrder: id,
    text: {
      [LANGUAGE.ENGLISH]: `Option ${id}`,
      [LANGUAGE.FRENCH]: `FR: Option ${id}`
    },
    value: id
  }
}

function createValidator () {
  return {
    name: 'require', // use it as a reference for parent question to enable/disable validator
    enabled: true,
    type: 'require',
    value: null,
    errorMessage: {
      [LANGUAGE.ENGLISH]: 'Required',
      [LANGUAGE.FRENCH]: 'Fr: Required'
    }
  }
}

function createDependencyGroup () {
  return {
    ruleType: 'visibility', // or validation or validationValue (questionDependencies should be only one item)
    childValidatorName: null,
    questionDependencies: []
  }
}

export default {
  createGroup,
  createQuestionnaire,
  createQuestion,
  createChildQuestion,
  createResponseOption,
  createValidator,
  createDependencyGroup
}
