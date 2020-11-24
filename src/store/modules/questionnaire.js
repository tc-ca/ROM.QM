import { XrmWebApi } from "../../services/questionnaireService";
import builderService from "../../services/builderService";

export const state = {
  questionnaire: null,
  questionnaireId: null
};
export const actions = {
  SetQuestionnaireIdState({ commit }, id) {
    alert('inside set id state')
    commit("setQuestionnaireId", id);
  },

  SetQuestionnaireState({ commit, dispatch }, payload) {
    const { questionnaire, page, id } = payload;
    switch (page) {
      case "builder":
        {
          alert('builder')
          // does some processing before setting state
          const {questionnaireData, groupsData} = builderService.processBuilderForSave(questionnaire);
          commit("setQuestionnaire", questionnaireData);
          dispatch("setQuestionnaireGroups", groupsData);
        }
        break;
      case "questionnaire":
        alert('questionnaire')
        commit("setQuestionnaire", questionnaire);
        dispatch("setQuestionnaireGroups", questionnaire.groups);
        break;
      default:
        break;
    }
              commit("setQuestionnaireId", id);
  },

  async SaveQuestionnaireStateToDynamics({ state }) {
    const questionnaire = state.questionnaire;
    const questionnaireId = state.questionnaire.questionnaireId
    const result = await XrmWebApi.SaveQuestionnaire(questionnaire, questionnaireId);
    return result;
  }
};

export const mutations = {
  setQuestionnaire(state, payload) {
    state.questionnaire = payload;
    alert('state looks like: '+JSON.stringify(state.questionnaire))
  },

  setQuestionnaireId(state, payload) {
    //state.questionnaireId = payload;
    alert("state looks like for id: " + state.questionnaireId);

    state.questionnaire.questionnaireId = payload;

  }
};
