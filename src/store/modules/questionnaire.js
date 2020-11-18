import _ from "lodash";
import questionnaireService from "../../services/questionnaireService";

export const state = {
  groups: [],
  groupsCopy: [],
  questionnaire: {}
};

export const actions = {
  save({ dispatch }, questionnaire) {
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
    dispatch("setQuestionnaireGroups", groups);
    state.questionnaire = questionnaire;

    // then serialize for saving
    questionnaire = _.cloneDeep(questionnaire);

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

    // console.log(JSON.stringify(questionnaire, null, 2))
  },
  // this action is similar to the the below 'getQuestionnaireGroups' but assumes you already have groups collection from somewhere non external
  async load({ commit }) {
    const r1 = await questionnaireService.Loadtemplate();
    alert('R1 value = ' + r1);
    commit('setTemplate', r1);
  }
};

export const mutations = {
  setQuestionnaire(state, payload) {
    state.questionnaire = payload;
  },
  setTemplate(state, payload) {
    alert('Entering mutation setTemplate with payload = ' + payload);
    state.template = payload;
  }
};

export const getters = {
  getTemplate (state) {
    return state.template;
  }
};
