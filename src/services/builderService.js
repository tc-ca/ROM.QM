import _ from "lodash";
import { LANGUAGE } from "../constants.js";
import { QUESTION_TYPE } from "../data/questionTypes.js";
import { v4 as uuidv4 } from "uuid";
import { generateName } from "../utils";

/* eslint-disable no-undef */

function createGroup(questionnaire) {
  let group = {};
  const id = getNextGroupId(questionnaire);
  group.title = {
    [LANGUAGE.ENGLISH]: "New Group",
    [LANGUAGE.FRENCH]: "Fr: New Group"
  };
  group.primaryKey = generateName(
    group.title[LANGUAGE.ENGLISH],
    "GRP",
    questionnaire.name
  );
  group.isRepeatable = false;
  group.isVisible = true;
  group.order = id;
  group.questions = [];
  group.expansionPanels = [];
  group.domSuffix = "prop value created virtually";
  group.htmlElementId = "prop value created virtually";

  return group;
}

function createQuestionnaire() {
  return {
    title: {
      [LANGUAGE.ENGLISH]: "Questionnaire Title EN",
      [LANGUAGE.FRENCH]: "Questionnaire Title EN"
    },
    name: generateName("Questionnaire Title EN", "TMPLT", ""),
    groups: [],
    templateid: "",
    searchableProvisions: [],
    readOnly: false
  };
}

function createQuestion(questionnaire, group) {
  let id = getNextQuestionId(questionnaire);
  let guid = uuidv4();
  let questionName = generateName("Question", "QTN", "RD_" + group.primaryKey);

  let question = {
    name: questionName,
    id: id,
    guid: guid,
    sortOrder: id,
    isVisible: true,
    isMultiple: true,
    text: {
      [LANGUAGE.ENGLISH]: "Question text",
      [LANGUAGE.FRENCH]: "FR: Question text"
    },
    type: "radio", // text, number, select, radio, boolean, image...
    response: null,
    isSamplingAllowed: false,
    samplingRecord: null,
    validationState: true, //not too sure what this should be set to by default
    isRepeatable: false,
    isRepeated: false,

    responseOptions: [
      {
        id: 1,
        name: generateName("Response Yes", "RSPNS", questionName),
        sortOrder: 1,
        text: {
          [LANGUAGE.ENGLISH]: "Yes",
          [LANGUAGE.FRENCH]: "FR: Yes"
        },
        value: "true",
        internalComment: {
          option: "optional",
          value: ""
        },
        externalComment: {
          option: "optional",
          value: ""
        },
        picture: {
          option: "optional",
          value: []
        },
        provisions: [],
        selectedProvisions: [],
        selectedProvisionsTitles: [],
        searchProvisions: null,
        isProvisionCollapsed: false
        // ...
      },
      {
        id: 2,
        name: generateName("Response No", "RSPNS", questionName),
        sortOrder: 2,
        text: {
          [LANGUAGE.ENGLISH]: "No",
          [LANGUAGE.FRENCH]: "FR: No"
        },
        value: "false",
        internalComment: {
          option: "optional",
          value: ""
        },
        externalComment: {
          option: "required",
          value: ""
        },
        picture: {
          option: "optional",
          value: []
        },
        provisions: [],
        selectedProvisions: [],
        selectedProvisionsTitles: [],
        searchProvisions: null,
        isProvisionCollapsed: false
      }
    ],
    validationRules: [
      {
        name: "require", // use it as a reference for parent question to enable/disable validator
        enabled: true,
        type: "require", // min, max....
        value: null,
        errorMessage: {
          [LANGUAGE.ENGLISH]: "Required",
          [LANGUAGE.FRENCH]: "FR: Required"
        }
      }
    ],
    violationInfo: {
      responseToMatch: "false", // value to compare to question.response. If matches then supplementaryInfo rule is applied
      matchingType: "equal", // notEqual, greaterThen, lessThen...
      referenceID: null
    },
    childQuestions: [],
    dependants: [],
    dependencyGroups: []
  };

  // question.name = 'Question ' + id

  return question;
}

function convertToReferenceQuestion(rQuestion) {
  rQuestion.name = "Reference ID";
  rQuestion.id = 0;
  rQuestion.sortOrder = 1;
  rQuestion.isMultiple = false;
  rQuestion.text = {
    [LANGUAGE.ENGLISH]: "Reference ID",
    [LANGUAGE.FRENCH]: "FR: Reference ID"
  };
  rQuestion.type = QUESTION_TYPE.REFERENCE;
  return rQuestion;
}

function createReferenceQuestion(questionnaire, group) {
  let rQuestion = createQuestion(questionnaire, group);
  rQuestion.name = "Reference ID";
  rQuestion.id = 0;
  rQuestion.sortOrder = 1;
  rQuestion.isMultiple = false;
  rQuestion.text = {
    [LANGUAGE.ENGLISH]: "Reference ID",
    [LANGUAGE.FRENCH]: "FR: Reference ID"
  };
  rQuestion.type = QUESTION_TYPE.REFERENCE;
  rQuestion.responseOptions = [];
  return rQuestion;
}

function findReferenceQuestion(group, guid = "") {
  let q = group.questions.find(
    q => q.type === QUESTION_TYPE.REFERENCE && q.guid !== guid
  );
  return q;
}

function findGroupForQuestionById(groups, qGuid) {
  let group = groups.find(g => {
    const q = g.questions.findIndex(q => q.guid === qGuid);
    if (q > -1) return true;
    return false;
  });
  return group;
}

function createChildQuestion(questionnaire, question, group) {
  let q = createQuestion(questionnaire, group);
  q.sortOrder = question.childQuestions.length + 1;
  return q;
}

function getNextGroupId(questionnaire) {
  return questionnaire.groups.length;
}

function getNextQuestionId(questionnaire) {
  let length = 0;
  questionnaire.groups.forEach(group => {
    length += getTotalQuestionsNumber(group.questions);
  });

  return length + 1;
}

function getTotalQuestionsNumber(questions) {
  let length = 0;
  length += questions.length;

  questions.forEach(q => {
    length += getTotalQuestionsNumber(q.childQuestions);
  });
  return length;
}

function createProvisions() {
  return this.$store.state.legislations;
}

function createResponseOption(question) {
  let id = question.responseOptions.length + 1;
  return {
    id: id,
    name: generateName(`Option ${id}`, "RSPNS", question.Name),
    sortOrder: id,
    text: {
      [LANGUAGE.ENGLISH]: `Option ${id}`,
      [LANGUAGE.FRENCH]: `FR: Option ${id}`
    },
    value: id,
    provisions: [], //createProvisions(),
    selectedProvisions: [],
    searchProvisions: null,
    isProvisionCollapsed: false,
    internalComment: {
      option: "optional",
      value: ""
    },
    externalComment: {
      option: "optional",
      value: ""
    },
    picture: {
      option: "optional",
      value: ""
    }
  };
}

function createValidator() {
  return {
    name: "require", // use it as a reference for parent question to enable/disable validator
    enabled: true,
    type: "require",
    value: null,
    errorMessage: {
      [LANGUAGE.ENGLISH]: "Required",
      [LANGUAGE.FRENCH]: "Fr: Required"
    }
  };
}

function createDependencyGroup() {
  return {
    ruleType: "visibility", // or validation or validationValue (questionDependencies should be only one item)
    childValidatorName: null,
    questionDependencies: []
  };
}

function processBuilderForSave(questionnaire) {
  let groups = _.cloneDeep(questionnaire.groups);

  let populateDependantsOnDependency = q => {
    q.dependencyGroups.forEach(dg => {
      dg.questionDependencies.forEach(qd => {
        //if dependents prop does not exist, its has been process already i.e. circular dependencies has been removed already.
        if (qd.dependsOnQuestion.dependants) {
          qd.dependsOnQuestion.dependants.push(q);
        }
      });
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
      dg.questionDependencies.forEach(qd => {
        //if dependents prop does not exist, its has been process already i.e. circular dependencies has been removed already.
        if (qd.dependsOnQuestion.dependants) {
          qd.dependsOnQuestion.dependants.push({ guid: q.guid });
        }
      });
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

  return { groupsData: groups, questionnaireData: questionnaire };
}

async function GetMockQuestionnaireFromImportModule() {
  if (process.env.NODE_ENV !== "production") {
    const axios = await import("axios");

    let response = await axios
      .get("/static/betaAnswers.json")
      .catch(function(error) {
        // handle error
        console.log(error);
      });

    console.log(response);

    return response.data;
  }
}

export default {
  createGroup,
  createQuestionnaire,
  createQuestion,
  createReferenceQuestion,
  convertToReferenceQuestion,
  createProvisions,
  createChildQuestion,
  createResponseOption,
  createValidator,
  createDependencyGroup,
  findReferenceQuestion,
  findGroupForQuestionById,
  getNextQuestionId,
  GetMockQuestionnaireFromImportModule,
  processBuilderForSave
};
