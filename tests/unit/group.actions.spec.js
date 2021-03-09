
import { actions } from '../../src/store/modules/group'
import _ from 'lodash'

describe('Test Group component Vuex Actions', () => {
  test('setQuestionnaireGroups', async () => {
    const context = {
      commit: jest.fn()
    }

    const groups = [{}, {}]

    actions.setQuestionnaireGroups(context, groups)
    expect(context.commit).toHaveBeenCalledWith('setGroups', {
      groups: [{}, {}]
    })
    expect(context.commit).toHaveBeenCalledWith('copyGroups', {
      groupsCopy: [{}, {}]
    })
  })

  let group0 = {
    name: 'Group 1',
    title: {
      'en': 'New Group',
      'fr': 'Fr: New Group'
    },
    isRepeatable: true,
    isVisible: true,
    questions: [],
    order: 0
  }

  let group1 = {
    name: 'Group 1',
    title: {
      'en': 'New Group',
      'fr': 'Fr: New Group'
    },
    isRepeatable: true,
    isVisible: true,
    questions: [],
    order: 1
  }

  let group2 = {
    name: 'Group 2',
    title: {
      'en': 'New Group',
      'fr': 'Fr: New Group'
    },
    isRepeatable: true,
    isVisible: true,
    questions: [],
    order: 2
  }

  let group3 = {
    name: 'Group 3',
    title: {
      'en': 'New Group',
      'fr': 'Fr: New Group'
    },
    isRepeatable: true,
    isVisible: true,
    questions: [],
    order: 3
  }

  test('repeated group should be placed into the correct position', async () => {
    let theOriginalListOfGroups = []
    theOriginalListOfGroups.push(group0)
    theOriginalListOfGroups.push(group1)
    theOriginalListOfGroups.push(group2)
    theOriginalListOfGroups.push(group3)

    let filteredSimilarGroups = _.cloneDeep(theOriginalListOfGroups.filter(e => e.name !== 'Group 2' && e.name !== 'Group 3'))

    const context = {
      commit: jest.fn(),
      getters: { getTargetedRepeatedGroups: () => filteredSimilarGroups }, // get all similar groups with similar identifying attribute in this case based on the name
      state: {
        groupsCopy: theOriginalListOfGroups
      },
      rootState: {
        questionnaire: {
          questionnaire: {
            groups: []
          }
        }
      }
    }

    // tests copying group from index 0
    let expected = _.cloneDeep(theOriginalListOfGroups[0])
    expected.order = 2

    actions.repeatGroup(context, theOriginalListOfGroups[0])
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: expected,
      insertAt: 2
    })

    // tests copying group from index 1
    let expected1 = _.cloneDeep(theOriginalListOfGroups[0])
    expected1.order = 2

    actions.repeatGroup(context, theOriginalListOfGroups[1])
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: expected1,
      insertAt: 2
    })

    // reset filtered groups to correct set
    filteredSimilarGroups = _.cloneDeep(theOriginalListOfGroups.filter(e => e.name === 'Group 2'))

    // tests copying group from index 2
    let expected2 = _.cloneDeep(theOriginalListOfGroups[2])
    expected2.order = 3

    actions.repeatGroup(context, theOriginalListOfGroups[2])
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: expected2,
      insertAt: 3
    })

    // reset filtered groups to correct set
    // reset filtered groups to correct set
    filteredSimilarGroups = _.cloneDeep(theOriginalListOfGroups.filter(e => e.name === 'Group 3'))

    // tests copying group from index 2
    let expected3 = _.cloneDeep(theOriginalListOfGroups[3])
    expected3.order = 4

    // tests copying group from index 3
    actions.repeatGroup(context, theOriginalListOfGroups[3])
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: expected3,
      insertAt: 4
    })
  })

  test('removeGroup', async () => {
    const context = {
      commit: jest.fn()
    }

    // test payload
    const group = {}

    actions.removeGroup(context, group)
    expect(context.commit).toHaveBeenCalledWith('removeGroup', {
      group: {}
    })
  })

  test('updateGroupOrder', async () => {
    const context = {
      commit: jest.fn()
    }

    const targetedGroup = { group: {}, order: 0 }

    actions.updateGroupOrder(context, targetedGroup)
    expect(context.commit).toHaveBeenCalledWith('UpdateGroupOrder', {
      group: {}
    })
  })

  test('updateGroupHtmlElementId', async () => {
    let filteredSimilarGroups = [
      {
        name: 'Group1',
        order: 0

      },
      {
        name: 'Group1',
        order: 1
      }
    ]
    const context = {
      commit: jest.fn(),
      getters: { getTargetedRepeatedGroups: () => filteredSimilarGroups } // get all similar groups with similar identifying attribute in this case based on the name
    }

    // test first item in the group array
    let group = { group: filteredSimilarGroups[0] }

    actions.updateGroupHtmlElementId(context, group)
    expect(context.commit).toHaveBeenCalledWith('updateGroupHtmlElementId', {
      group: filteredSimilarGroups[0], domSuffix: '#000'
    })

    // test second item in the group array
    group = { group: filteredSimilarGroups[1] }

    actions.updateGroupHtmlElementId(context, group)
    expect(context.commit).toHaveBeenCalledWith('updateGroupHtmlElementId', {
      group: filteredSimilarGroups[1],
      domSuffix: '#001'
    })
  })
})
