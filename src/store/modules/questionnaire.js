import _ from "lodash";
import questionnaireService from "../../services/questionnaireService.js";

export const state = {
  questionnaire: {},
  template: {}
};
export const actions = {
  save({ commit, dispatch }, questionnaire) {
    // first save to state for use in questionnaire
    let groups = _.cloneDeep(questionnaire.groups);

    let populateDependantsOnDependency = q => {
      q.dependencyGroups.forEach(dg => {
        dg.questionDependencies.forEach(qd =>
          qd.dependsOnQuestion.dependants.push(q)
        );
      });
      q.childQuestions.forEach(cq => populateDependantsOnDependency(cq));
    };

    groups.forEach(g => {
      g.questions.forEach(q => {
        populateDependantsOnDependency(q);
      });
    });

    //processing is done for groups, can safely set the state.
    dispatch("setQuestionnaireGroups", groups);

    let populateDependantsOnDependencyIds = q => {
      q.dependencyGroups.forEach(dg => {
        dg.questionDependencies.forEach(qd =>
          qd.dependsOnQuestion.dependants.push(q.id)
        );
      });
      q.childQuestions.forEach(cq => populateDependantsOnDependencyIds(cq));
    };

    questionnaire.groups.forEach(g => {
      g.questions.forEach(q => {
        populateDependantsOnDependencyIds(q);
      });
    });

    let removeCircularRefFromDependency = question => {
      question.dependencyGroups.forEach(dg => {
        dg.questionDependencies.forEach(qd => {
          qd.dependsOnQuestion = qd.dependsOnQuestion.id;
        });
      });

      question.childQuestions.forEach(cq =>
        removeCircularRefFromDependency(cq)
      );
    };

    questionnaire.groups.forEach(g => {
      g.questions.forEach(q => {
        removeCircularRefFromDependency(q);
      });
    });
        
    commit("setQuestionnaire", questionnaire);

  },

  async SetQuestionnaireState({ commit, dispatch }, questionnaire) {
    //TODO: check if this processing step is needed.
    // const test = questionnaireService.GetQuestionnaireGroups(JSON.parse(questionnaire));

    commit("setQuestionnaire", questionnaire);
    dispatch("setQuestionnaireGroups", questionnaire.groups);
  },
  async SaveQuestionnaireStateToDynamics({state}) {

    const questionnaire = state.questionnaire;
    const result = await questionnaireService.SaveTemplate(
      questionnaire
    );
    return result;
  }
};

export const mutations = {
  setQuestionnaire(state, payload) {
    const { questionnaire } = payload;
    state.questionnaire = questionnaire
  },

  setTemplate(state, payload) {
    state.template = payload;
  }
};

export const getters = {
  getTemplate(state) {
    return state.template;
  }
};
