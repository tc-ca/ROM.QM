import _ from "lodash";
import { LANGUAGE } from "../constants.js";
import { QUESTION_TYPE } from "../data/questionTypes.js";
import { v4 as uuidv4 } from 'uuid';
import { generateName, isString, setNewGUID } from '../utils'

/* eslint-disable no-undef */

function createQuestionnaire() {
  let guid = uuidv4();
  let questionnaire = {
    guid: guid,
    name: guid,
    readOnly: false,
    title: {
      [LANGUAGE.ENGLISH]: "Questionnaire Title EN",
      [LANGUAGE.FRENCH]: "Questionnaire Title EN"
    },
    groups: [],
    searchableProvisions: []
  };
  return questionnaire;
}

function createGroup(index) {
  let guid = uuidv4();
  let group = {
    domId: "",
    domSuffix: "",
    guid: guid,
    name: guid,
    sortOrder: (index) ? index + 1 : 1,
    title: {
      [LANGUAGE.ENGLISH]: "New Group",
      [LANGUAGE.FRENCH]: "Fr: New Group"
    },
    isRepeatable: false,
    isVisibleByDefault: true,
    questions: []
  };
  return group;
}

function createQuestion(parent, type = QUESTION_TYPE.RADIO) {
  let guid = uuidv4();
  let sortOrder = (parent.questions !== undefined) ? parent.questions.length + 1: parent.childQuestions.length + 1;
  
  let responseOptions = [];
  if (type === QUESTION_TYPE.RADIO) {
    responseOptions.push(createResponseOption(1,{[LANGUAGE.ENGLISH]: "Yes",[LANGUAGE.FRENCH]: "Oui"},"true"));
    responseOptions.push(createResponseOption(2,{[LANGUAGE.ENGLISH]: "No",[LANGUAGE.FRENCH]: "Non"},"false"));
  } else if (type === QUESTION_TYPE.SELECT) {
    responseOptions.push(createResponseOption(1,{[LANGUAGE.ENGLISH]: "Option 1",[LANGUAGE.FRENCH]: "Option 1"},"1"));
    responseOptions.push(createResponseOption(2,{[LANGUAGE.ENGLISH]: "Option 2",[LANGUAGE.FRENCH]: "Option 2"},"2"));
  } else {
    responseOptions.push(createResponseOption(1,null,""));
  }

  let validationRules = [];
  validationRules.push(createGenericValidationRule());

  let question = {
    guid: guid,
    name: guid,
    sortOrder: sortOrder,
    text: {
      [LANGUAGE.ENGLISH]: "Question text",
      [LANGUAGE.FRENCH]: "FR: Question text"
    },
    type: type,
    isRepeatable: false,
    isRepeated: false,
    isSamplingAllowed: false,
    isVisible: true,
    responseOptions: responseOptions,
    validationRules: validationRules,
    validationState: true,
    dependants: [],
    dependencyGroups: [],
    childQuestions: [],
    result: null
  };
  return question;
}

function convertToReferenceQuestion(rQuestion) {
  rQuestion.sortOrder = 1;
  rQuestion.text = {
    [LANGUAGE.ENGLISH]: "Reference ID",
    [LANGUAGE.FRENCH]: "FR: Reference ID"
  };
  rQuestion.type = QUESTION_TYPE.REFERENCE;
  rQuestion.childQuestions = [];
  rQuestion.responseOptions = [];
  rQuestion.responseOptions.push(createResponseOption(1,null,""));
  rQuestion.validationRules = [];
  rQuestion.validationRules.push(createGenericValidationRule());

  rQuestion.isRepeatable = false;
  rQuestion.isRepeated = false;
  rQuestion.isSamplingAllowed = false;
  rQuestion.isVisible = true;
  rQuestion.dependants = [];
  rQuestion.dependencyGroups = [];
  rQuestion.result = null;

  return rQuestion;
}

function createReferenceQuestion(group) {
  let rQuestion = createQuestion(group, QUESTION_TYPE.REFERENCE);
  return convertToReferenceQuestion(rQuestion);
}

function createGenericValidationRule() {
  return {
    guid: uuidv4(),
    enabled: true,
    errorMessage: {
      [LANGUAGE.ENGLISH]: "Required",
      [LANGUAGE.FRENCH]: "FR Required"
    },
    name: "require",
    type: "require",
    value: null
  }
}

function createGenericResponseOption(sortOrder = -1) {
  let guid = uuidv4();
  return {
    guid: guid,
    name: guid,
    sortOrder: sortOrder,
    text: {
      [LANGUAGE.ENGLISH]: `Option`,
      [LANGUAGE.FRENCH]: `FR: Option`
    },
    value: "1",
    internalCommentRequirement: "optional",
    externalCommentRequirement: "optional",
    pictureRequirement: "optional",
    fileRequirement: "optional",
    provisions: [],
    searchProvisions: null,
    isProvisionCollapsed: false
  };
}

function createResponseOption(sortOrder,text, value) {
  let ro = createGenericResponseOption(sortOrder);
  ro.text = text;
  ro.value = value;
  return ro;
}

function findReferenceQuestion(group, guid = "") {
  let q = group.questions.find(
    q => q.type === QUESTION_TYPE.REFERENCE && q.guid !== guid
  );
  return q;
}

function GenerateRepeatedQuestion(oQuestion) {
  let nQuestion = null;
  try {
    nQuestion = _.cloneDeep(oQuestion);
    setNewGUID(nQuestion);
    nQuestion.isRepeatable = false;
    nQuestion.isRepeated = true;
    nQuestion.isVisible = true;
    nQuestion.sortOrder = oQuestion.sortOrder + 1;

    //Fixing dependants on new Question
    nQuestion.dependants.forEach(d => {
       const idx = oQuestion.childQuestions.findIndex(ocq => ocq.guid === d.guid);
       if (idx > -1) {
         d.guid = nQuestion.childQuestions[idx].guid;
       }
    });

    //Fixing dependency groups for every child question
    nQuestion.childQuestions.forEach(cq => {
      cq.dependencyGroups.forEach(dp => {
        dp.questionDependencies.forEach(qd => {
          if (qd.dependsOnQuestion.guid === oQuestion.guid) {
            qd.dependsOnQuestion.guid = nQuestion.guid;
          } else {
            const idx = oQuestion.childQuestions.findIndex( ocq => ocq.guid === qd.dependsOnQuestion.guid);
            if( idx > -1) {
              qd.dependsOnQuestion.guid = nQuestion.childQuestions[idx].guid;
            }
          }
        });
      });
    });

    //Fixing dependants for every child question
    nQuestion.childQuestions.forEach( cq => {
      cq.dependants.forEach( d => {
        if (d.guid === oQuestion.guid) {
          d.guid = nQuestion.guid;
        } else {
          const idx = oQuestion.childQuestions.findIndex (ocq => ocq.guid === d.guid);
          if (idx > -1) {
            d.guid = nQuestion.childQuestions[idx].guid;
          }
        }
      });
    });

  } catch (error) {
    // Generate Error
    nQuestion = null;
  }
  return nQuestion;
}

function findGroupForQuestionById(groups, qGuid) {
  let group = groups.find(g => {
    const q = g.questions.findIndex(q => q.guid === qGuid);
    if (q > -1) return true;
    return false;
  });
  return group;
}

function createProvisions() {
  return this.$store.state.legislations;
}

function createDependencyGroup() {
  return {
    guid: uuidv4(),
    ruleType: "visibility",
    childValidatorName: "",
    questionDependencies: []
  };
}

function createGenericQuestionDependency() {
  return {
    guid: uuidv4(),
    dependsOnQuestion: [],
    validationAction: "equal",
    validationValue: "false"
  };
}

function createQuestionDependency(dependsOnGuid, validationAction = "equal", validationValue = "false") {
  let qd = createGenericQuestionDependency()
  qd.dependsOnQuestion.push( { guid: dependsOnGuid});
  qd.validationAction = validationAction;
  qd.validationValue = validationValue;
  return qd;
}

function createGenericResult() {
  let result = {
    externalComment: '',
    internalComment: '',
    files: null,
    pictures: null,
    samplingRecord: null,
    responses: [],
    violationInfo: null
  };
  return result;
}

function processBuilderForSave(questionnaire) {
  //Done by LM on Feb 14 to avoid console error on Dynamic Builder
  if (!questionnaire) return; 
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

async function GetMockQuestionnaireFromImportModule(templateToLoad = 'fullFeaturedTemplate') {
  if(process.env.NODE_ENV !== 'production') 
  {
    const axios = await import('axios')

    // let response = await axios.get('/static/betaAnswers.json')
    console.log('Template: ' + templateToLoad)
    let response = await axios.get(`/static/templates/${templateToLoad}.json`)
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    if (response) {
      console.log(response);
      return response.data;
    } else {
      console.log('Error on response: Response is NULL');
      return null;
    }
  }
}

/**
 * Will find you all instances of the unique values (key) that are not unique 
 * @param {Questionnaire Object - can be a Group, Question or Response} qObject 
 * @param {What is the property name of the field used for uniqueness for this type of object} key 
 */
function FindNonUniqueIds (qObject, key) {
  var uniqueIds = []
  var issues = []
  var index = 0

  qObject.forEach(element => {
    if (!uniqueIds.includes(element[key])) {
      uniqueIds.push(element[key])
    } else {
      issues.push(`item ${index} has id ${element[key]} which is not unique`)
    }
    index++
  })

  if (issues.length > 0) {
    console.log(issues)
  }

  return issues
}

/**
 * will recursively flatten a list of Questions
 * @param {Array of Questions} qs 
 */
function flatten (qs) {
  var ret = []

  for (var i = 0; i < qs.length; i++) {
    let q = qs[i]

    if (q.childQuestions.length > 0) {
      ret = ret.concat(flatten(q.childQuestions))
    }

    ret.push(q)
  }
  return ret
}

/**
 * Will return you a flattened list of all Questions for all items in the array
 * @param {An Array of Groups} groups 
 */
function flattenQuestions (groups) {
  var flattenedQuestions = []
  groups.forEach(group => {
    var qs = flatten(group.questions)
    flattenedQuestions = flattenedQuestions.concat(qs)
  })
  return flattenedQuestions.sort((a, b) => (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0)
}

/**
 * Will attempt to make old Templates compatible with the current structure of Templates 
 * @param {An Array of Groups} groups 
 */
function fixTemplate (template) {

  var groups = template.groups
  var qIndex;
  var rIndex;
  var gIndex;
  var pIndex;
  var question;
  var response;
  var provision;
  var searchableProvisions = [];
  var fixLog = []

  //First, fix the isRepeatable on false for every child question, later build the flattenedQuestions with this fix
  groups.forEach( g => {
    g.questions.forEach( q => {
      q.childQuestions.forEach( cq => {
        if (cq.isRepeatable) {
          cq.isRepeatable = false
          fixLog.push(`fixTemplate: fixing isRepeatable prop for Child Question ${cq.text.en} with guid ${cq.guid}`)
        }
      });
    });
  });


  var flattenedQuestions = flattenQuestions(groups)

  /**
   * Fix Template
   */
  if (template.readOnly === undefined) {
    /**
     * Add the readOnly property to the Template if it does not exist
     */
    template.readOnly = false
    fixLog.push("fixTemplate: set readOnly prop on Template to false")
  }

  /**
   * Fix Groups
   */
  for (gIndex = 0; gIndex < groups.length; gIndex++) {
    let g = groups[gIndex];

    /**
     * Groups have to have the expansionPanels Property - but reset the value if it exists
     * TODO: this should really be removed from the JSON, its only temporary data and not important to the business
     */
    g.expansionPanels = []

    if (g.primaryKey === undefined || !g.primaryKey.includes('GRP') || g.primaryKey.includes("'")) {
      g.primaryKey = generateName(g.title[LANGUAGE.ENGLISH], 'GRP', template.name)
      fixLog.push(`fixTemplate: added/reset primaryKey prop for Group ${gIndex} to ${g.primaryKey}`)
    }
  }
  fixLog.push("fixTemplate: reset/added expansionPanels prop to all Groups")

  /**
   * Fix Questions
   */
  for (qIndex = 0; qIndex < flattenedQuestions.length; qIndex++) {
    question = flattenedQuestions[qIndex]

    /**
     * re-generate question name based on its english name if it's not in our new format
     */
    if (question.name === undefined || !question.name.includes('QTN') || question.name.includes("'")) {
      question.name = generateName(question.text[LANGUAGE.ENGLISH], 'QTN', '')
      fixLog.push(`fixTemplate: added/reset name prop for Question ${qIndex} to ${question.name}`)
    }

    let repeatedNames = flattenedQuestions.filter( q => q.name === question.name && q.guid !== question.guid);
    repeatedNames.forEach(rn => {
      const qIndx = flattenedQuestions.findIndex(fq => fq.guid === rn.guid);
      if(qIndx) {
        flattenedQuestions[qIndx].name = flattenedQuestions[qIndx].name + ` v${qIndx}`;
        fixLog.push(`fixTemplate: fixing repeated name prop for Question ${qIndx} to ${flattenedQuestions[qIndx].name}`)
      }
    })

    /**
     * Fix repeated ids in questions
     */
    question.id = qIndex + 1;

    /**
    * Will assign a unique guid to all Questions in all items within 
    * the Array of Groups that do not already have one assigned to them 
    */
    if (question.guid === undefined) {
      question.guid = uuidv4()
      fixLog.push(`fixTemplate: added guid (${question.guid}) prop to Question ${question.name}`)
    }

    /**
     * move the internal comment property from the question to the responses of this question
     */
    if (question.internalComment) {

      if (question.type === "radio" || question.type === "select")
      {
        if (question.responseOptions === undefined || question.responseOptions === null) { 
          question.responseOptions = [];
          fixLog.push(`fixTemplate: responseOptions field missed in ${question.name}, added as an empty array `)
        }
        for (rIndex = 0; rIndex < question.responseOptions.length; rIndex++) {
          response = question.responseOptions[rIndex];
          response.internalComment = question.internalComment
        }
      }

      delete question.internalComment

      fixLog.push(`fixTemplate: moved internal comment prop from Question ${question.name} to Responses`)
    }

    /**
     * move the external comment property from the question to the responses of this question
     */
    if (question.externalComment) {
      if (question.type === "radio" || question.type === "select")
      {
        if (question.responseOptions === undefined || question.responseOptions === null) { 
          question.responseOptions = [];
          fixLog.push(`fixTemplate: responseOptions field missed in ${question.name}, added as an empty array `)
        }
        for (rIndex = 0; rIndex < question.responseOptions.length; rIndex++) {
          response = question.responseOptions[rIndex];
          response.externalComment = question.externalComment
        }
      }

      delete question.externalComment

      fixLog.push(`fixTemplate: moved external comment prop from Question ${question.name} to Responses`)
    }

    /**
     * move the picture property from the question to the responses of this question
     */
    if (question.picture) {
      if (question.type === "radio" || question.type === "select")
      {
        if (question.responseOptions === undefined || question.responseOptions === null) { 
          question.responseOptions = [];
          fixLog.push(`fixTemplate: responseOptions field missed in ${question.name}, added as an empty array `)
        }
        for (rIndex = 0; rIndex < question.responseOptions.length; rIndex++) {
          response = question.responseOptions[rIndex];
          response.picture = question.picture
        }
      }

      delete question.picture

      fixLog.push(`fixTemplate: moved picture prop from Question ${question.name} to Responses`)
    }

    /**
     * there has to be a default validationState on the Question object
     */
    if (question.validationState === undefined) {
      question.validationState = true
    }

    /**
     * ensure the violation info property is up to date
     */
    if (question.violationInfo === undefined) {
      /**
       * there is no violationInfo prop on the object. Add a default value
       */
      question.violationInfo = 
      {
        responseToMatch: "false",
        matchingType: "equal",
        referenceID: null,
        violationCount: null
      }
      fixLog.push(`fixTemplate: added default violationInfo prop to Question ${question.name}`)
    } else {
      if (question.violationInfo.referenceID === undefined) {
        /**
         * there is no referenceId prop on the violationInfo prop. Add a default value
         */
        question.violationInfo.referenceID = null
        fixLog.push(`fixTemplate: added default referenceId to violationInfo object of Question ${question.name}`)
      }

      if (question.violationInfo.violationCount === undefined) {
        /**
         * there is no violationCount prop on the violationInfo prop. Add a default value
         */
        question.violationInfo.violationCount = null
        fixLog.push(`fixTemplate: added default violationCount for violationInfo object of Question ${question.name}`)
      }
    }

    /**
     * Fix Question Responses for radio and select questions
     */
    if (question.type === "radio" || question.type === "select")
    {
      if (question.responseOptions === undefined || question.responseOptions === null) { 
        question.responseOptions = [];
        fixLog.push(`fixTemplate: responseOptions field missed in ${question.name}, added as an empty array `)
      }
      for (rIndex = 0; rIndex < question.responseOptions.length; rIndex++) {
        response = question.responseOptions[rIndex];

        /**
         * Internal Comment prop should exist on Responses
         * Might not have existed on Question to copy over
         */
        if (response.internalComment === undefined)
        {
          response.internalComment = {
            "option": "optional",
            "value": ""
          }
          fixLog.push(`fixTemplate: added default internalComment prop for Response ${rIndex} of Question ${question.name}`)
        }

        /**
         * External Comment prop should exist on Responses
         * Might not have existed on Question to copy over
         */
        if (response.externalComment === undefined)
        {
          response.externalComment = {
            "option": "optional",
            "value": ""
          }
          fixLog.push(`fixTemplate: added default externalComment prop for Response ${rIndex} of Question ${question.name}`)
        }

        /**
         * picture prop should exist on Responses, and should be an array of strings, not a single string
         */
        if (response.picture === undefined || response.picture.value === '') {
          response.picture = {
            "option": "optional",
            "value": []
          }
          fixLog.push(`fixTemplate: added default picture prop for Response ${rIndex} of Question ${question.name}`)
        }


        /**
         * response values must be of type String and not number or anything else
         * TODO: always though? maybe we revisit this in schema
         */
        if (!isString(response.value)) {
          response.value = String(response.value)
          fixLog.push(`fixTemplate: stringified response value for Response ${rIndex} of Question ${question.name}`)
        }


      /**
       * generate response names for responses that do not have them
       */
        if (response.name === undefined || !response.name.includes('RSPNS') || response.name.includes("'")){
          response.name = generateName(response.text[LANGUAGE.ENGLISH], 'RSPNS', question.name, false)
          fixLog.push(`fixTemplate: added/reset name prop for Response ${rIndex} of Question ${question.name}`)
        }

        /**
         * add file prop if not exists 
         */

        if (response.file === undefined || response.file.value === '') {
          response.file = {
            "option": "optional",
            "value": []
          }
          fixLog.push(`fixTemplate: added default file prop for Response ${rIndex} of Question ${question.name}`)
        }

      }
    } else {
      if (question.responseOptions === undefined || question.responseOptions === null) { 
        question.responseOptions = [];
        fixLog.push(`fixTemplate: responseOptions field missed in ${question.name}, added as an empty array `)
      } else if (question.responseOptions && question.responseOptions.length > 0) {
        // shouldnt have any response options...TODO: or should they?
        question.responseOptions = []
        fixLog.push(`fixTemplate: removed response options from ${question.type} Question ${question.name}`)
      }
    }
  }

  /**
   * add the searchable provisions property to the template if it doesnt exist
   * searchableProvisions is the distinct union of all provisions for all responses in the template
   * basically, all provisions this template is related to 
   */
  if (template.searchableProvisions === undefined) {

    for (qIndex = 0; qIndex < flattenedQuestions.length; qIndex++) {
      question = flattenedQuestions[qIndex];

      // only radio and select have response options
      if (question.responseOptions === undefined && !(question.type === "radio" || question.type === "select")) continue

      if (question.responseOptions === undefined || question.responseOptions === null) { 
        question.responseOptions = [];
        fixLog.push(`fixTemplate: responseOptions field missed in ${question.name}, added as an empty array `)
      }

      for (rIndex = 0; rIndex < question.responseOptions.length; rIndex++) {
        response = question.responseOptions[rIndex];
        
        if (response.provisions.length > 0) {
          for (pIndex = 0; pIndex < response.provisions.length; pIndex++) {
            /**
             * for each provision in this response, check if there is already an item in the searchable provisions list for this provision
             * if there is we can simply add the guidId of the question to it, else we add a new entry to the searchable provisions list 
             */
            provision = response.provisions[pIndex];
            var existingSearchableProvisionIndex = searchableProvisions.findIndex(sp => sp.leg === provision)

            if (existingSearchableProvisionIndex !== -1)
            {
              var existingSearchableProvision = searchableProvisions[existingSearchableProvisionIndex]
              
              if (!existingSearchableProvision.questions.includes(question.guid)) {
                existingSearchableProvision.questions.push(question.guid)
              }
            } else {
              searchableProvisions.push({
                leg: provision,
                questions: [question.guid]
              })
            }
          }
        }
      }
    }

    template.searchableProvisions = searchableProvisions

    fixLog.push("fixTemplate: added searchableProvisions prop to Template")
  }

  downloadData(fixLog, "fixItLog.json")
  downloadData(template, "fixedTemplate.json")

  return template;
}

function updateTemplate (template) {
  var updateLog = []
  
  updateLog.push("updateTemplate: do something")
  downloadData(updateLog, "updateLog.json")
  downloadData(template, "updatedTemplate.json")
  return template;
}

function downloadData (data, filename){
  if(!data) {
      console.error('Console.save: No data')
      return;
  }

  if(!filename) filename = 'console.json'

  if(typeof data === "object"){
      data = JSON.stringify(data, undefined, 4)
  }

  var blob = new Blob([data], {type: 'text/json'}),
      e    = document.createEvent('MouseEvents'),
      a    = document.createElement('a')

  a.download = filename
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  a.dispatchEvent(e)
}

function isParentAGroup (group, qGuid) {
  let idx = -1;
  if (group) {
    idx = group.questions.findIndex( q => q.guid === qGuid);
  }
  return (idx > -1);
}

function cloneVisibleQuestionsOnly(questionnaire) {
  let clonedGroups = _.cloneDeep(questionnaire.groups)
  clonedGroups.forEach( g => {
    g.questions = g.questions.filter( q => q.isVisible === true );
    g.questions.forEach( gc => {
      gc.childQuestions = gc.childQuestions.filter( cq => cq.isVisible === true );
    });
  });
  return clonedGroups;
}

function fixQuestionSpecialCharacters(question) {
  question.name = question.name.replaceAll('"','');
  question.text.en = question.text.en.replaceAll('"','');
  question.text.fr = question.text.fr.replaceAll('"','');
  if (question.responseOptions) {
    question.responseOptions.forEach( ro => {
      ro.name = ro.name.replaceAll('"','');
    });
  }
  return question;
}

function fixTextToShowInDrawer(groups) {
  groups.forEach( g => {
    g.title.en = g.title.en.replaceAll('"','');
    g.title.fr = g.title.fr.replaceAll('"','');
    g.questions.forEach( gc => {
      gc = fixQuestionSpecialCharacters(gc);
      // eslint-disable-next-line no-unused-vars
      gc.childQuestions.forEach( cq => {
        cq = fixQuestionSpecialCharacters(cq);
      });
    });
  });
  return groups;
}

export default {
  createGroup,
  createQuestionnaire,
  createQuestion,
  createReferenceQuestion,
  convertToReferenceQuestion,
  createProvisions,
  createGenericResponseOption,
  createResponseOption,
  createDependencyGroup,
  findReferenceQuestion,
  findGroupForQuestionById,
  GetMockQuestionnaireFromImportModule,
  processBuilderForSave,
  FindNonUniqueIds,
  flattenQuestions,
  fixTemplate,
  updateTemplate,
  GenerateRepeatedQuestion,
  isParentAGroup,
  cloneVisibleQuestionsOnly,
  fixTextToShowInDrawer,
  createGenericValidationRule,
  createQuestionDependency,
  createGenericQuestionDependency,
  createGenericResult
};
