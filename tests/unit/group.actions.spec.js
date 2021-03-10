
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
    guid: '47847837438408302948923489',
    name: 'Group 1',
    title: {
      'en': 'New Group',
      'fr': 'Fr: New Group'
    },
    isRepeatable: true,
    isVisible: true,
    questions: [],
    sortOrder: 0
  }

  let group1 = {
    guid: '11147847837438408302948923489',
    name: 'Group 1',
    title: {
      en: 'New Group',
      fr: 'Fr: New Group'
    },
    isRepeatable: true,
    isVisible: true,
    questions: [],
    sortOrder: 1
  }

  let group2 = {
    guid: '22247847837438408302948923489',

    name: 'Group 2',
    title: {
      en: 'New Group',
      fr: 'Fr: New Group'
    },
    isRepeatable: true,
    isVisible: true,
    questions: [],
    sortOrder: 2
  }

  let group3 = {
    guid: '33347847837438408302948923489',

    name: 'Group 3',
    title: {
      en: 'New Group',
      fr: 'Fr: New Group'
    },
    isRepeatable: true,
    isVisible: true,
    questions: [],
    sortOrder: 3
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
    expected.sortOrder = 2
    let guid = '47847837438408302948923489'
    actions.repeatGroup(context, {
      group: theOriginalListOfGroups[0],
      guid: theOriginalListOfGroups[0].guid,
      groups: theOriginalListOfGroups
    })
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: expected,
      insertAt: 2
    })

    // tests copying group from index 1
    let expected1 = _.cloneDeep(theOriginalListOfGroups[0])
    expected1.sortOrder = 2

    actions.repeatGroup(context, {
      group: theOriginalListOfGroups[1],
      guid: theOriginalListOfGroups[1].guid,
      groups: theOriginalListOfGroups
    })
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: expected1,
      insertAt: 2
    })

    // reset filtered groups to correct set
    filteredSimilarGroups = _.cloneDeep(theOriginalListOfGroups.filter(e => e.name === 'Group 2'))

    // tests copying group from index 2
    let expected2 = _.cloneDeep(theOriginalListOfGroups[2])
    expected2.sortOrder = 3

    actions.repeatGroup(context, {
      group: theOriginalListOfGroups[2],
      guid: theOriginalListOfGroups[2].guid,
      groups: theOriginalListOfGroups
    })
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: expected2,
      insertAt: 3
    })

    // reset filtered groups to correct set
    // reset filtered groups to correct set
    filteredSimilarGroups = _.cloneDeep(theOriginalListOfGroups.filter(e => e.name === 'Group 3'))

    // tests copying group from index 2
    let expected3 = _.cloneDeep(theOriginalListOfGroups[3])
    expected3.sortOrder = 4

    // tests copying group from index 3
    actions.repeatGroup(context, {
      group: theOriginalListOfGroups[3],
      guid: theOriginalListOfGroups[3].guid,
      groups: theOriginalListOfGroups
    })
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
    const groups = []

    actions.removeGroup(context, group)
    expect(context.commit).toHaveBeenCalledWith('removeGroup', {
      group: {},
      groups
    })
  })

  test('updateGroupDomId', async () => {
    let filteredSimilarGroups = [
      {
        name: 'Group1',
        sortOrder: 0

      },
      {
        name: 'Group1',
        sortOrder: 1
      }
    ]
    const context = {
      commit: jest.fn(),
      getters: { getTargetedRepeatedGroups: () => filteredSimilarGroups } // get all similar groups with similar identifying attribute in this case based on the name
    }

    // test first item in the group array
    let group = { group: filteredSimilarGroups[0] }

    actions.updateGroupDomId(context, group)
    expect(context.commit).toHaveBeenCalledWith('UPDATE_GROUP_DOM_ID', {
      group: filteredSimilarGroups[0],
      domSuffix: '#000'
    })

    // test second item in the group array
    group = { group: filteredSimilarGroups[1] }

    actions.updateGroupDomId(context, group)
    expect(context.commit).toHaveBeenCalledWith('UPDATE_GROUP_DOM_ID', {
      group: filteredSimilarGroups[1],
      domSuffix: '#001'
    })
  })
})
