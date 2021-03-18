// TODO: optimize later, pull down only method required.
import _ from "lodash";
import { pad } from "../../utils.js";
import BuilderService from "../../services/builderService";

export const state = {
  groups: [],
  groupsCopy: []
};

export const getters = {
  getTargetedRepeatedGroups(state) {
    return name => {
      return state.groups.filter(x => x.name === name);
    };
  }
};

export const actions = {
  setQuestionnaireGroups({ commit }, groups) {
    const groupsCopy = _.cloneDeep(groups);
    commit("setGroups", { groups });
    commit("copyGroups", { groupsCopy });
  },

  repeatGroup({ commit, state, rootState, getters }, payload) {

    const  {group, guid} = payload
    // get all similar groups
    const targetedRepeatedGroups = getters.getTargetedRepeatedGroups(
      group.name
    );
    // get starting reference for group in the collection of group array i.e. starting point/index 4
    const repeatedGroupsOrders = targetedRepeatedGroups.map(
      group => group.sortOrder
    );
    const startReference = Math.min(...repeatedGroupsOrders);

    // get last position of the targeted repeated group
    const repeatGroupCount = targetedRepeatedGroups.length;

    // insert copied group at end of similar repeated groups
    const insertAtEndOfTargetedRepeatedGroups =
      startReference + repeatGroupCount;
    // find group in copied array
    const targetedGroupToCopy = state.groupsCopy.find(
      copy => copy.name === group.name
    );

    const copiedGroup = _.cloneDeep(targetedGroupToCopy);
    copiedGroup.guid = guid

    //Just to reuse the old code, we are doing the cloneDeep, now we have to fix the questions
    //for this reaason, we deleted the questions on the cloned group, and one by one, repeating
    //every question on the old one to the new one: this way we warranty that the question have
    //the real order and dependencies
    copiedGroup.questions = [];
    const questionnaire = rootState.questionnaire.questionnaire;
    targetedGroupToCopy.questions.forEach(oq => {
      let nq = BuilderService.GenerateRepeatedQuestion(questionnaire, oq);

      nq.isRepeatable = oq.isRepeatable;
      nq.isRepeated = oq.isRepeated;
      // nq.isVisible = oq.isVisible;
      nq.sortOrder = oq.sortOrder;

      copiedGroup.questions.push(nq);
    });

    // Regenerate a new GUID for every question
    // copiedGroup.questions.forEach( q => { q.guid = uuidv4(); })

    // update new group order
    copiedGroup.sortOrder = insertAtEndOfTargetedRepeatedGroups;
    // const groupsWithSameName  =  getters.getTargetedRepeatedGroups(copiedGroup.name);
    commit("repeatGroup", {
      copiedGroup,
      insertAt: insertAtEndOfTargetedRepeatedGroups,
      groups: state.groups
    });
  },

  removeGroup({ commit }, group) {

    commit("removeGroup", { group, groups: state.groups });
  },

  updateGroupDomId({ commit, getters }, payload) {
    const { group } = payload;
    const targetedRepeatedGroups = getters.getTargetedRepeatedGroups(
      group.name
    );
    const repeatedGroupsOrders = targetedRepeatedGroups.map(
      group => group.sortOrder
    );
    const suffix = repeatedGroupsOrders.findIndex(
      order => order === group.sortOrder
    );
    const domSuffix = `#${pad(suffix, 3)}`;

    commit("UPDATE_GROUP_DOM_ID", { group, domSuffix: domSuffix });
  }
};

export const mutations = {
  setGroups(state, payload) {
    const { groups } = payload;
    state.groups = groups;
  },
  copyGroups(state, payload) {
    const { groupsCopy } = payload;
    state.groupsCopy = groupsCopy;
  },

  UPDATE_GROUP_DOM_ID(state, payload) {
    const { group, domSuffix } = payload;
    group.domId = `${group.name}${domSuffix}`;
    group.domSuffix = domSuffix;
  },

  repeatGroup(state, payload) {
    const { copiedGroup, insertAt, groups } = payload;
    // add copied group to groups array
    state.groups.splice(insertAt, 0, copiedGroup);
    const groupsWithSameName = getTargetedRepeatedGroups(groups,
      copiedGroup.name
    );
    for (let i = insertAt; i < state.groups.length; i++) {
      state.groups[i].sortOrder = i;
      const domSuffix = getDomSuffix(copiedGroup, groupsWithSameName);
      state.groups[i].domSuffix = domSuffix;
      state.groups[i].domId = `${copiedGroup.name}${domSuffix}`;
    }
  },

  removeGroup(state, payload) {
    const { group, groups } = payload;

    const removeAt = group.sortOrder;
    state.groups.splice(removeAt, 1);
    const groupsWithSameName = getTargetedRepeatedGroups(groups, group.name);

    for (let i = removeAt; i < state.groups.length; i++) {
      state.groups[i].sortOrder = i;
      const domSuffix = getDomSuffix(group, groupsWithSameName);
      state.groups[i].domId = `${group.name}${domSuffix}`;
    }
  }
};

function getDomSuffix(group, groupsWithSameName) {
  const repeatedGroupsOrders = groupsWithSameName.map(group => group.sortOrder);
  const suffix = repeatedGroupsOrders.findIndex(
    order => order === group.sortOrder
  );
  return `#${pad(suffix, 3)}`;
}

  function getTargetedRepeatedGroups(groups, name) {
      return groups.filter(x => x.name === name);
  }
