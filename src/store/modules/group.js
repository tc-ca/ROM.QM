// TODO: optimize later, pull down only method required.
import _ from 'lodash';
import { pad } from '../../utils.js';
//import { v4 as uuidv4 } from 'uuid';
import BuilderService from '../../services/builderService';

export const state = {
  groups: [],
  groupsCopy: []
}

export const getters = {
  getTargetedRepeatedGroups (state) {
    return (name) => {
      return state.groups.filter(x => x.name === name)
    }
  }
}

export const actions = {
  setQuestionnaireGroups ({ commit }, groups) {
    const groupsCopy = _.cloneDeep(groups)
    commit('setGroups', { groups })
    commit('copyGroups', { groupsCopy })
  },

  repeatGroup ({ commit, state, rootState, getters }, group) {
    // get all similar groups
    const targetedRepeatedGroups = getters.getTargetedRepeatedGroups(group.name)
    // get starting reference for group in the collection of group array i.e. starting point/index 4
    const repeatedGroupsOrders = targetedRepeatedGroups.map(group => group.sortOrder)
    const startReference = Math.min(...repeatedGroupsOrders)

    // get last position of the targeted repeated group
    const repeatGroupCount = targetedRepeatedGroups.length

    // insert copied group at end of similar repeated groups
    const insertAtEndOfTargetedRepeatedGroups = startReference + repeatGroupCount
    // find group in copied array
    const targetedGroupToCopy = state.groupsCopy.find(copy => copy.name === group.name)

    const copiedGroup = _.cloneDeep(targetedGroupToCopy)

    //Just to reuse the old code, we are doing the cloneDeep, now we have to fix the questions
    //for this reaason, we deleted the questions on the cloned group, and one by one, repeating
    //every question on the old one to the new one: this way we warranty that the question have 
    //the real order and dependencies
    copiedGroup.questions = [];
    const questionnaire = rootState.questionnaire.questionnaire;
    targetedGroupToCopy.questions.forEach( oq => {
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
    copiedGroup.sortOrder = insertAtEndOfTargetedRepeatedGroups

    commit('repeatGroup', { copiedGroup, insertAt: insertAtEndOfTargetedRepeatedGroups })
  },

  removeGroup ({ commit }, group) {
    commit('removeGroup', { group })
  },

  updateGroupOrder ({ commit }, targetedGroup) {
    const { group, index } = targetedGroup
    commit('UpdateGroupOrder', { group, order: index })
  },
  updateGroupHtmlElementId ({ commit, getters }, payload) {
    const { group } = payload
    const targetedRepeatedGroups = getters.getTargetedRepeatedGroups(group.name)
    const repeatedGroupsOrders = targetedRepeatedGroups.map(group => group.sortOrder)
    const suffix = repeatedGroupsOrders.findIndex(order => order === group.sortOrder)
    const domSuffix = `#${pad(suffix, 3)}`

    commit('updateGroupHtmlElementId', { group, domSuffix: domSuffix })
  }
}

export const mutations = {
  setGroups (state, payload) {
    const { groups } = payload
    state.groups = groups
  },
  copyGroups (state, payload) {
    const { groupsCopy } = payload
    state.groupsCopy = groupsCopy
  },
  // TODO: lowercase function name
  UpdateGroupOrder (state, payload) {
    const { group, order } = payload
    group.sortOrder = order
  },

  updateGroupHtmlElementId (state, payload) {
    const { group, domSuffix } = payload
    group.htmlElementId = `${group.name}${domSuffix}`
    group.domSuffix = domSuffix
  },

  repeatGroup (state, payload) {
    const { copiedGroup, insertAt } = payload
    // add copied group to groups array
    state.groups.splice(insertAt, 0, copiedGroup)
  },

  removeGroup (state, payload) {
    const { group } = payload
    for (let index = state.groups.length; index--;) {
      if (state.groups[index].sortOrder === group.sortOrder) {
        state.groups.splice(index, 1)
      }
    }
  }
}
