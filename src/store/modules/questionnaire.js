import { XrmWebApi } from "../../services/questionnaireService";
import builderService from "../../services/builderService";

export const state = {
  questionnaire: null
};

export const getters = {
  getQuestionnaire (state) {
    return state.questionnaire;
  }
};

export const actions = {
  SetQuestionnaireState({ commit, dispatch }, payload) {
    const { questionnaire, page, id } = payload;
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
          alert("questionnaire");
          commit("setQuestionnaire", questionnaire);
          dispatch("setQuestionnaireGroups", questionnaire.groups);
        }

        break;
      default:
        break;
    }
    commit("setQuestionnaireId", id);
  },

  async SaveQuestionnaireStateToDynamics({ state }) {
    const questionnaire = state.questionnaire;
    const questionnaireId = state.questionnaire.questionnaireId;
    const result = await XrmWebApi.SaveQuestionnaire(
      questionnaire,
      questionnaireId
    );
    return result;
  }
};

export const mutations = {
  setQuestionnaire(state, payload) {
    state.questionnaire = payload;
  },

  setQuestionnaireId(state, payload) {
    state.questionnaire.questionnaireId = payload;
  }
};
