import _ from "lodash";
import { LANGUAGE } from '../constants.js';
import { QUESTION_TYPE } from "../data/questionTypes.js";
import { v4 as uuidv4 } from 'uuid';

/* eslint-disable no-undef */

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
  group.order = id
  group.questions = []
  group.order = id
  group.domSuffix = 'prop value created virtually'
  group.htmlElementId = 'prop value created virtually'

  return group
}

function createQuestionnaire () {
  return {
    name: 'Questionnaire 1',
    title: {
      [LANGUAGE.ENGLISH]: 'Questionnaire Title EN',
      [LANGUAGE.FRENCH]: 'Questionnaire Title EN'
    },
    groups: [],
    templateid: ''
  }
}

function createQuestion (questionnaire) {
  let id = getNextQuestionId(questionnaire)
  let guid = uuidv4();
  let question = {
    name: 'Question',
    id: id,
    guid: guid,
    sortOrder: id,
    isVisible: true,
    isMultiple: true,
    text: {
      [LANGUAGE.ENGLISH]: 'Question text',
      [LANGUAGE.FRENCH]: 'FR: Question text'
    },
    type: 'radio', // text, number, select, radio, boolean, image...
    response: null,
    isSamplingAllowed: false,
    samplingRecord: null,
    responseOptions: [
      {
        id: 1,
        sortOrder: 1,
        text: {
          [LANGUAGE.ENGLISH]: 'Yes',
          [LANGUAGE.FRENCH]: 'FR: Yes'
        },
        value: 'true',
        internalComment: {
          option: 'optional', value: ''
        },
        externalComment: {
          option: 'optional', value: ''
        },
        picture: {
          option: 'optional', value: ''
        },
        provisions: [],
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
        internalComment: {
          option: 'optional', value: ''
        },
        externalComment: {
          option: 'required', value: ''
        },
        picture: {
          option: 'optional', value: ''
        },
        provisions: [],
        selectedProvisions: [],
        selectedProvisionsTitles: [],
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
    childQuestions: [

    ],
    dependants: [],
    dependencyGroups: []
  }

  question.name = 'Question ' + id

  return question
}

function createReferenceQuestion (questionnaire) {
  let rQuestion = createQuestion(questionnaire)
  rQuestion.name = 'Reference ID'
  rQuestion.id = 0
  rQuestion.sortOrder = 1
  rQuestion.isMultiple = false
  rQuestion.text = {
    [LANGUAGE.ENGLISH]: 'Reference ID',
    [LANGUAGE.FRENCH]: 'FR: Reference ID'
  }
  rQuestion.type = QUESTION_TYPE.REFERENCE
  return rQuestion
}

function findReferenceQuestion(group, guid = "") {
  let q = group.questions.find( q => (q.type === QUESTION_TYPE.REFERENCE && q.guid !== guid));
  return q;
}

function findGroupForQuestionById(groups, qGuid) {
  let group = groups.find( g => {
    const q = g.questions.findIndex(q => q.guid === qGuid)
    if (q > -1) return true;
    return false;
  });
  return group;
}

function createChildQuestion (questionnaire, question) {
  let q = createQuestion(questionnaire)
  q.sortOrder = question.childQuestions.length + 1
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
  return this.$store.state.legislations
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
    provisions: [],//createProvisions(),
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


function processBuilderForSave(questionnaire){
  let groups = _.cloneDeep(questionnaire.groups);

  let populateDependantsOnDependency = q => {
    q.dependencyGroups.forEach(dg => {
      dg.questionDependencies.forEach(qd =>{
        
        //if dependents prop does not exist, its has been process already i.e. circular dependencies has been removed already.
        if (qd.dependsOnQuestion.dependants){
          qd.dependsOnQuestion.dependants.push(q);
        }

      }
      );
    });
    q.childQuestions.forEach(cq => populateDependantsOnDependency(cq));
  };

  groups.forEach(g => {
    g.questions.forEach(q => {
      populateDependantsOnDependency(q);
    });
  });


  let populateDependantsOnDependencyGuids = q => {
    q.dependencyGroups.forEach(dg => {
      dg.questionDependencies.forEach(qd =>
        {
          //if dependents prop does not exist, its has been process already i.e. circular dependencies has been removed already.
          if (qd.dependsOnQuestion.dependants) {
            qd.dependsOnQuestion.dependants.push({ guid: q.guid });
          }
        }
      );
    });
    q.childQuestions.forEach(cq => populateDependantsOnDependencyGuids(cq));
  };

  questionnaire.groups.forEach(g => {
    g.questions.forEach(q => {
      populateDependantsOnDependencyGuids(q);
    });
  });

  let removeCircularRefFromDependency = question => {
    question.dependencyGroups.forEach(dg => {
      dg.questionDependencies.forEach(qd => {
        qd.dependsOnQuestion = { guid: qd.dependsOnQuestion.guid };
      });
    });

    question.childQuestions.forEach(cq => removeCircularRefFromDependency(cq));
  };

  questionnaire.groups.forEach(g => {
    g.questions.forEach(q => {
      removeCircularRefFromDependency(q);
    });
  });

  return {groupsData:groups, questionnaireData:questionnaire}

}

export default {
  createGroup,
  createQuestionnaire,
  createQuestion,
  createReferenceQuestion,
  createProvisions,
  createChildQuestion,
  createResponseOption,
  createValidator,
  createDependencyGroup,
  processBuilderForSave,
  findReferenceQuestion,
  findGroupForQuestionById
};
