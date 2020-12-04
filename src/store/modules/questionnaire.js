import builderService from "../../services/builderService";

export const state = {
  questionnaire: null
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
  RemoveBuilderCircularDependencies({ commit, state, dispatch }) {
    const questionnaire = state.questionnaire;

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
