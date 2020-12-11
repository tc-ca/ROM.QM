import _ from "lodash";
import builderService from "../../services/builderService";

export const state = {
  questionnaire: null,
  questionProvisionReference: {},
  provisionFilter: null
};

function GetChildrenQuestion(question) {
  let questions = [];
  question.childQuestions.forEach(childQuestion => {
    questions.push(childQuestion);
  });
  return questions;
}

export const getters = {
  getQuestionnaire(state) {
    return state.questionnaire;
  },
  getFlatListOfAllQuestions(state) {
    let questions = [];
    const groups = state.questionnaire.groups;

    groups.forEach(group => {
      group.questions.forEach(question => {
        // for each group add question to array
        questions.push(question);
        //check to see if question has children questions
        let childrenQuestions = GetChildrenQuestion(question);
        let childrenCount = childrenQuestions.length;

        while (childrenCount > 0) {
          for (let index = 0; index < childrenQuestions.length; index++) {
            let childQuestion = childrenQuestions[index];
            //add child question to array
            questions.push(childQuestion);
            //check to see if child has children
            const children = GetChildrenQuestion(childQuestion);
            //
            childrenCount = children.length;
            //wtv children questions that have been found will add it to the loop/queue for processing
            childrenQuestions = childrenQuestions.concat(children);
          }
        }
      });
    });
    // return questions.map(x => x.id); for debugging
    return questions;
  }
};

export const actions = {
  async SetMockQuestionnaireResponse({ commit, dispatch }) {
    const data = await SetMockQuestionnaireResponseImportModule();
    commit("setQuestionnaire", data);
    dispatch("setQuestionnaireGroups", data.groups);
  },
  SetQuestionnaireState({ commit, dispatch }, payload) {
    const { questionnaire, page } = payload;
    switch (page) {
      case "builder":
        {
          // builder does some processing before setting state

          const {
            questionnaireData,
            groupsData
          } = builderService.processBuilderForSave(questionnaire);
          commit("setQuestionnaire", questionnaireData);
          dispatch("setQuestionnaireGroups", groupsData);
        }
        break;
      case "questionnaire":
        {
          commit("setQuestionnaire", questionnaire);
          dispatch("setQuestionnaireGroups", questionnaire.groups);
        }

        break;
      default:
        break;
    }
  },
  // RemoveBuilderCircularDependencies({ commit, state, dispatch }) {
  //   const questionnaire = state.questionnaire;

  //   const {
  //     questionnaireData,
  //     groupsData
  //   } = builderService.processBuilderForSave(questionnaire);
  //   commit("setQuestionnaire", questionnaireData);
  //   dispatch("setQuestionnaireGroups", groupsData);
  // }

  UpdateSearchableProvisions({ commit }, payload) {
    const { provisions, questionGuid } = payload;

    //how many provisions is the question tied to
    //check if the question exist in ref
    let diffArray = [];

    const questionReferenceExist =
      state.questionProvisionReference[questionGuid];

    const oldCount = questionReferenceExist
      ? state.questionProvisionReference[questionGuid].legs.length
      : 0;
    const newCount = provisions.length;

    if (newCount > oldCount) {
      provisions.forEach(provision => {
        const provisionKey = provision;
        const provisionExist = state.questionnaire.searchableProvisions.find(
          p => p.leg === provisionKey
        );
  
        const isQuestionAttachedToProvision = provisionExist? provisionExist.questions.includes(questionGuid):false

        if (!isQuestionAttachedToProvision) {
          commit("addSearchableProvision", {
            provisionKey,
            questionGuid
          });
        }
      });
    } else if (newCount < oldCount) {
      //check arrays and see difference, that difference needs to be removed
      const referenceProvisions =
        state.questionProvisionReference[questionGuid].legs;
      diffArray = _.difference(referenceProvisions, provisions);

      commit("removeSearchableProvision", {
        questionGuid,
        provisionsToBeRemoveFrom: diffArray
      });
    }

    commit("setRef", {
      provisions,
      questionGuid
    });

    // provisions.forEach(provision => {
    //   const provisionKey = provision;

    //   const provisionExist = state.questionnaire.searchableProvisions.find(
    //     p => p.leg === provisionKey
    //   );

    //   // console.log("ProvisionKey", provisionKey);

    //   if (!provisionExist) {
    //     commit("addSearchableProvision", {
    //       provisionKey,
    //       questionGuid
    //     });
    //   } else {
    //     const isQuestionAttachedToProvision = provisionExist.questions.includes(
    //       questionGuid
    //     );
    //     //add questions

    //     switch (condition) {
    //       case "add":
    //         if (!isQuestionAttachedToProvision) {
    //           commit("addSearchableProvision", {
    //             provisionKey,
    //             questionGuid
    //           });
    //         }

    //         break;
    //       case "remove":
    //         // commit("removeSearchableProvision", {
    //         //   questionGuid,
    //         //   provisionsToBeRemoveFrom: diffArray,
    //         // });
    //         break;

    //       default:
    //         break;
    //     }
    //   }
    // });
  },

  UpdateProvisionFilter({ commit }, payload) {
    commit("updateProvisionFilter", payload);
  },

  InitializeRef({ commit, getters }) {
    const questions = getters.getFlatListOfAllQuestions;
    commit("initializeRef", { questions });
  }
};

export const mutations = {
  setQuestionnaire(state, payload) {
    state.questionnaire = payload;
  },

  addSearchableProvision(state, payload) {
    const { provisionKey, questionGuid } = payload;

    if (!state.questionnaire.searchableProvisions) {
      state.questionnaire.searchableProvisions = [];
    }
    state.questionnaire.searchableProvisions.push({
      leg: provisionKey,
      questions: [questionGuid]
    });
  },

  removeSearchableProvision(state, payload) {
    const { provisionsToBeRemoveFrom, questionGuid } = payload;

    provisionsToBeRemoveFrom.forEach(item => {
      let provision = state.questionnaire.searchableProvisions.find(
        x => x.leg === item
      );

      console.log(
        "old searchable",
        JSON.stringify(state.questionnaire.searchableProvisions)
      );
      const newArray = _.remove(provision.questions, questionGuid);

      if (newArray.length === 0) {
        let provisionIndex = state.questionnaire.searchableProvisions.findIndex(
          x => x.leg === item
        );
        state.questionnaire.searchableProvisions.splice(provisionIndex, 1);
      }
      provision.questions = newArray;
      // console.log(newArray);
      console.log(
        "new searchable",
        JSON.stringify(state.questionnaire.searchableProvisions)
      );

      //TODO: if provisions do not have any questions asscoiated to it, delete the provision from the arary
    });
  },

  setRef(state, payload) {
    const { provisions, questionGuid } = payload;

    //wipe it clean each time
    state.questionProvisionReference[questionGuid] = {};

    state.questionProvisionReference[questionGuid].legs = provisions;
  },

  initializeRef(state, payload) {
    const { questions } = payload;

    //wipe it clean each time
    // state.questionProvisionReference[questionGuid] = {};

    // state.questionProvisionReference[questionGuid].legs = provisions;

    let provisions = [];
    questions.forEach(q => {
      state.questionProvisionReference[q.guid] = { legs: [] };
      q.responseOptions.forEach(r => {
        provisions = provisions.concat(r.provisions);
      });
      state.questionProvisionReference[q.guid].legs = provisions;
      provisions = [];
    });
  },

  updateProvisionFilter(state, payload) {
    const { provisionFilter } = payload;
    state.provisionFilter = provisionFilter;
  }
};

async function SetMockQuestionnaireResponseImportModule() {
  const data = await import("../../api/betaAnswers").then(module => {
    return module.default;
  });
  return data;
}
