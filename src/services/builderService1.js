import { LANGUAGE } from '../constants.js'

/* eslint-disable no-undef */

// async function GetLegislations() {
//   var req = new XMLHttpRequest();
//   req.open("GET", "http://localhost:3000/children", true);
//   req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//   req.onreadystatechange = function() {
//       if (this.readyState === 4) {
//           req.onreadystatechange = null;
//           if (this.status === 200) {
//             localStorage.setItem('legislations-data', this.response)
//           } else {
//               console.log(this.statusText);
//           }
//       }
//   };
//   req.send();
// }





async function GetLegislations() {
  
  var Sdk = window.Sdk || {};
  /**
  * Request to execute WhoAmI function
  */
  Sdk.ovs_LegislationsGet = function () { };
  // NOTE: The getMetadata property should be attached to the function prototype instead of the
  // function object itself.
  Sdk.ovs_LegislationsGet.prototype.getMetadata = function () {
  return {
  boundParameter: null,
  parameterTypes: {},
  operationType: 0,
  operationName: "ovs_LegislationsGet"
  };
  };
  
  // Construct a request object from the metadata
  var templateGetRequest = new Sdk.ovs_LegislationsGet();

  await Xrm.WebApi.online.execute(templateGetRequest).then(
      function success(result) {
        //Xrm.Utility.alertDialog(result)
        //localStorage.setItem('my-result', result)
        alert('bananna!')
        alert(JSON.stringify(result))
          if (result.ok) {
              Xrm.Utility.alertDialog(JSON.stringify(result.responseText))
              //localStorage.setItem('legislations-data', result.responseText)
          }
      },
      function(error) {
          Xrm.Utility.alertDialog(error.message)
      }
  );
}

function createGroup (questionnaire) {
  let group = {}
  const id = getNextGroupId(questionnaire)

  group.primaryKey = `Group ${id + 1}`
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
        value: 'true',
        provisions: createProvisions(),
        selectedProvisions: [],
        searchProvisions: null,
        isProvisionCollapsed: false,
      // ...
      },
      {
        id: 2,
        sortOrder: 2,
        text: {
          [LANGUAGE.ENGLISH]: 'No',
          [LANGUAGE.FRENCH]: 'FR: No'
        },
        value: 'false',
        provisions: createProvisions(),
        selectedProvisions: [],
        searchProvisions: null,
        isProvisionCollapsed: false,
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
      option: 'optional', value: ''
    },
    externalComment: {
      option: 'optional', value: ''
    },
    picture: {
      option: 'optional', value: ''
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

function createProvisions() {
  //console.log(JSON.parse(localStorage.getItem('legislations-data')))
  return localStorage.getItem('legislations-data')
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
    value: id,
    provisions: createProvisions(),
    selectedProvisions: [],
    searchProvisions: null,
    isProvisionCollapsed: false,
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
  GetLegislations,
  createGroup,
  createQuestionnaire,
  createQuestion,
  createProvisions,
  createChildQuestion,
  createResponseOption,
  createValidator,
  createDependencyGroup
}
