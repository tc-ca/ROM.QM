import _ from "lodash";
import { XrmWebApi } from "../../services/questionnaireService";

export const state = {
  questionnaire: null,
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

   SetQuestionnaireState({ commit, dispatch }, questionnaire) {
    commit("setQuestionnaire",  questionnaire );
    dispatch("setQuestionnaireGroups", questionnaire.groups);
  },
  async SaveQuestionnaireStateToDynamics({state}) {

    const questionnaire = state.questionnaire;
    const result = await XrmWebApi.SaveTemplate(
      questionnaire
    );
    return result;
  }
};

export const mutations = {
  setQuestionnaire(state, payload) {
    state.questionnaire = payload
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
