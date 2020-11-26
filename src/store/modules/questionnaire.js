import builderService from "../../services/builderService";

export const state = {
  questionnaire: null
};

export const getters = {
  getQuestionnaire(state) {
    return state.questionnaire;
  }
};

export const actions = {
  async SetMockQuestionnaireResponse({ commit , dispatch }) {
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
         RemoveBuilderCircularDependencies({ commit, state, dispatch,}) {
         const questionnaire = state.questionnaire
         
           const {
             questionnaireData,
             groupsData
           } = builderService.processBuilderForSave(questionnaire);
           commit("setQuestionnaire", questionnaireData);
           dispatch("setQuestionnaireGroups", groupsData);
         }
       };

export const mutations = {
  setQuestionnaire(state, payload) {
    state.questionnaire = payload;
  }
};

async function SetMockQuestionnaireResponseImportModule() {
  const data = await import("../../api/betaAnswers").then(module => {
    return module.default;
  });
  return data;
}
