// TODO: optimize later, pull down only method required.
import _ from 'lodash'
import { pad } from '../../utils.js'
import questionnaireService from '../../services/questionnaireService.js'
export const state = {
  groups: [],
  groupsCopy: []
}

export const getters = {
  getTargetedRepeatedGroups (state) {
    return (primaryKey) => {
      return state.groups.filter(x => x.primaryKey === primaryKey)
    }
  }
}

export const actions = {
  // this action is similar to the the below 'getQuestionnaireGroups' but assumes you already have groups collection from somewhere non external
  setQuestionnaireGroups ({ commit }, groups) {
    const groupsCopy = _.cloneDeep(groups)
    commit('setGroups', { groups })
    commit('copyGroups', { groupsCopy })
  },
  getQuestionnaireGroupsRequestComplete(response, commit){
    var jsonResponse = JSON.parse(response)
    const groupsCopy = _.cloneDeep(jsonResponse)

    commit('setGroups', { jsonResponse })
    commit('copyGroups', { groupsCopy })
  },
  // use this action when wanting to retrieve from questionnaire schema from api. mocking call for now
  getQuestionnaireGroups ({ commit }, schema) {
    console.log('ains')
      questionnaireService.Loadtemplate(schema, this.getQuestionnaireGroupsRequestComplete, commit)
      //const groupsCopy = _.cloneDeep(groups)
      //commit('setGroups', { groups })
      //commit('copyGroups', { groupsCopy })
  },
  repeatGroup ({ commit, state, getters }, group) {
    // get all similar groups
    // const targetedRepeatedGroups = state.questionnaire.groups.filter(x => x.primaryKey === group.primaryKey) // TODO: remove
    const targetedRepeatedGroups = getters.getTargetedRepeatedGroups(group.primaryKey)
    // get starting reference for group in the collection of group array i.e. starting point/index 4
    const repeatedGroupsOrders = targetedRepeatedGroups.map(group => group.order)
    const startReference = Math.min(...repeatedGroupsOrders)

    // get last position of the targeted repeated group
    const repeatGroupCount = targetedRepeatedGroups.length

    // insert copied group at end of similar repeated groups
    const insertAtEndOfTargetedRepeatedGroups = startReference + repeatGroupCount
    // find group in copied array
    const targetedGroupToCopy = state.groupsCopy.find(copy => copy.primaryKey === group.primaryKey)

    const copiedGroup = _.cloneDeep(targetedGroupToCopy)
    // update new group order
    copiedGroup.order = insertAtEndOfTargetedRepeatedGroups

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
    const targetedRepeatedGroups = getters.getTargetedRepeatedGroups(group.primaryKey)
    const repeatedGroupsOrders = targetedRepeatedGroups.map(group => group.order)
    const suffix = repeatedGroupsOrders.findIndex(order => order === group.order)
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
    group.order = order
  },

  updateGroupHtmlElementId (state, payload) {
    const { group, domSuffix } = payload
    group.htmlElementId = `${group.primaryKey}${domSuffix}`
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
      if (state.groups[index].order === group.order) {
        state.groups.splice(index, 1)
      }
    }
  }
}
