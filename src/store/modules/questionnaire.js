import _ from "lodash";
import builderService from "../../services/builderService";
import { onlyUniqueObj } from '../../utils'

export const state = {
  questionnaire: null,
  searchableProvisionRef: {},
  provisionFilter: null,
  tagFilter: []
};

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
  },

  getSearchableProvisions(state, getters, rootState) {
    const questionnaire = state.questionnaire;
    const legislations = rootState.legislations.legislations

    if (
      questionnaire === null || legislations === null
    ) {
      return [];
    }
    const searchableProvisions = questionnaire.searchableProvisions;
    let dictionaryOfProvisions = legislations;
    let provisions = [];

    searchableProvisions.forEach(x => {
      const hydratedItem = dictionaryOfProvisions[x.leg];
      const newProvision = { ...x, ...hydratedItem };
      provisions.push(newProvision);
    });
    return provisions;
  },

  getAllAppliedTagProvisions(state) {
    let provisions = []
     state.tagFilter.forEach(tag => {
     provisions = provisions.concat(tag.provisions)
    });
    return provisions
  }
};

export const actions = {
  setQuestionnaireReadOnlyStatus({ commit }, payload) {
    commit("setQuestionnaireReadOnlyStatus", payload);
  },

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

  RemoveBuilderCircularDependencies({ commit, state, dispatch }) {
    const questionnaire = state.questionnaire;

    const {
      questionnaireData,
      groupsData
    } = builderService.processBuilderForSave(questionnaire);
    commit("setQuestionnaire", questionnaireData);
    dispatch("setQuestionnaireGroups", groupsData);
  },

  UpdateSearchableProvisionsState({ commit }, payload) {
    const { provisions, questionGuid } = payload;

    // add provisions not already added to the searchableProvisions list.
    provisions.forEach(provision => {
      const provisionId = provision;
      const foundProvision = state.questionnaire.searchableProvisions.find(
        p => p.leg === provisionId
      );

      const isQuestionAttachedToProvision = foundProvision
        ? foundProvision.questions.includes(questionGuid)
        : false;

      if (!isQuestionAttachedToProvision) {
        commit("addSearchableProvision", {
          provision: foundProvision,
          provisionId,
          questionGuid
        });
      }
    });

    // removes provisions from the searchableProvision list.
    // check arrays and see if any difference, that difference needs to be removed
    if (state.searchableProvisionRef[questionGuid]) {
      let diffArray = [];

      diffArray = _.difference(
        state.searchableProvisionRef[questionGuid].legs,
        provisions
      );

      if (diffArray.length > 0) {
        commit("removeSearchableProvision", {
          questionGuid,
          provisionsToBeRemoveFrom: diffArray
        });
      }
    }

    commit("setSearchableProvisionRef", {
      provisions,
      questionGuid
    });
  },

  UpdateProvisionFilterState({ commit }, payload) {
    commit("updateProvisionFilter", payload);
  },

  /**
   * required for reloading existing builder
   *
   * @param {*} { commit, getters }
   */
  InitializeSearchableProvisionRef({ commit, getters }) {
    const questions = getters.getFlatListOfAllQuestions;
    commit("initializeSearchableProvisionRef", { questions });
  },

  UpdateTagFilterState({ commit, state, getters }, payload) {
    const {
      characteristicProvisions,
      characteristicCategory,
    } = payload;

    const searchableProvisions = getters.getSearchableProvisions

    //extract provisions from searchableProvisions
    let hydratedCharacteristicProvisions = [];

    characteristicProvisions.forEach(obj => {
      hydratedCharacteristicProvisions = hydratedCharacteristicProvisions.concat(
        searchableProvisions.filter(x => obj.provisions.includes(x.id))
      );
    });

    // the same provision could be associated to multiple characteristics
    // ensure a unique result set
    hydratedCharacteristicProvisions = onlyUniqueObj(hydratedCharacteristicProvisions, "id");

    const index = state.tagFilter.findIndex(
      x => x.name === characteristicCategory
    );
    const isFound = index === -1 ? false : true;

    commit("updateTagFilterState", {
      isFound,
      index,
      characteristicProvisions: hydratedCharacteristicProvisions,
      tag: { name: characteristicCategory, provisions: hydratedCharacteristicProvisions }
    });
  }
};

export const mutations = {
  setQuestionnaire(state, payload) {
    state.questionnaire = payload;
  },

  setQuestionnaireReadOnlyStatus(state, payload) {
    state.questionnaire.readOnly = payload;
  },

  addSearchableProvision(state, payload) {
    const { provision, provisionId, questionGuid } = payload;

    if (!state.questionnaire.searchableProvisions) {
      state.questionnaire.searchableProvisions = [];
    }

    if (provision) {
      provision.questions.push(questionGuid);
    } else {
      state.questionnaire.searchableProvisions.push({
        leg: provisionId,
        questions: [questionGuid]
      });
    }
  },

  removeSearchableProvision(state, payload) {
    const { provisionsToBeRemoveFrom, questionGuid } = payload;

    provisionsToBeRemoveFrom.forEach(item => {
      let provision = state.questionnaire.searchableProvisions.find(
        x => x.leg === item
      );

      const updatedArrayOfQuestions = _.remove(provision.questions, p => {
        return p !== questionGuid;
      });

      //remove the provision if there is no other questions associated to it
      if (updatedArrayOfQuestions.length === 0) {
        let provisionIndex = state.questionnaire.searchableProvisions.findIndex(
          x => x.leg === item
        );
        state.questionnaire.searchableProvisions.splice(provisionIndex, 1);
      } else {
        //update the provision questions minus the provisions to be removed.
        provision.questions = updatedArrayOfQuestions;
      }
    });
  },

  setSearchableProvisionRef(state, payload) {
    const { provisions, questionGuid } = payload;

    //wipe it clean each time
    state.searchableProvisionRef[questionGuid] = {};

    state.searchableProvisionRef[questionGuid].legs = provisions;
  },

  initializeSearchableProvisionRef(state, payload) {
    const { questions } = payload;

    let provisions = [];
    questions.forEach(q => {
      state.searchableProvisionRef[q.guid] = { legs: [] };
      if(q.responseOptions) {
        q.responseOptions.forEach(r => {
          provisions = provisions.concat(r.provisions);
        });
        state.searchableProvisionRef[q.guid].legs = provisions;
        provisions = [];
      }
    });
  },

  updateProvisionFilter(state, payload) {
    const { provisionFilter } = payload;
    state.provisionFilter = provisionFilter;
  },
  updateTagFilterState(state, payload) {
    const { isFound, index, tag } = payload;

    if (isFound) {
      state.tagFilter[index] = tag;
    } else {
      state.tagFilter.push(tag);
    }
  }
};

function GetChildrenQuestion(question) {
  let questions = [];
  question.childQuestions.forEach(childQuestion => {
    questions.push(childQuestion);
  });
  return questions;
}

async function SetMockQuestionnaireResponseImportModule() {
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
