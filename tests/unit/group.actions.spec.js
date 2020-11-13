
import { actions } from '../../src/store/modules/group'

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

  // TODO: add test
  test('getQuestionnaireGroups', async () => {

  })

  test('repeated group should be placed into the correct position', async () => {
    const theOriginalListOfGroups = [
      {
        primaryKey: 'Group1',
        order: 0
      },
      {
        primaryKey: 'Group1',
        order: 1
      },
      {
        primaryKey: 'Group2',
        order: 2
      },
      {
        primaryKey: 'Group3',
        order: 3
      }
    ]

    let filteredSimilarGroups = [
      {
        primaryKey: 'Group1',
        order: 0
      },
      {
        primaryKey: 'Group1',
        order: 1
      }
    ]
    const context = {
      commit: jest.fn(),
      getters: { getTargetedRepeatedGroups: () => filteredSimilarGroups }, // get all similar groups with similar identifying attribute in this case based on the primaryKey
      state: {
        groupsCopy: theOriginalListOfGroups
      }
    }

    // tests copying group from index 0
    actions.repeatGroup(context, theOriginalListOfGroups[0])
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: { order: 2, primaryKey: 'Group1' },
      insertAt: 2
    })

    // tests copying group from index 1
    actions.repeatGroup(context, theOriginalListOfGroups[1])
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: { order: 2, primaryKey: 'Group1' },
      insertAt: 2
    })

    // reset filtered groups to correct set
    filteredSimilarGroups = [
      {
        primaryKey: 'Group2',
        order: 2
      }
    ]

    // tests copying group from index 2
    actions.repeatGroup(context, theOriginalListOfGroups[2])
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: { order: 3, primaryKey: 'Group2' },
      insertAt: 3
    })

    // reset filtered groups to correct set
    filteredSimilarGroups = [
      {
        primaryKey: 'Group3',
        order: 3
      }
    ]

    // tests copying group from index 3
    actions.repeatGroup(context, theOriginalListOfGroups[3])
    expect(context.commit).toHaveBeenCalledWith('repeatGroup', {
      copiedGroup: { order: 4, primaryKey: 'Group3' },
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
        primaryKey: 'Group1',
        order: 0

      },
      {
        primaryKey: 'Group1',
        order: 1
      }
    ]
    const context = {
      commit: jest.fn(),
      getters: { getTargetedRepeatedGroups: () => filteredSimilarGroups } // get all similar groups with similar identifying attribute in this case based on the primaryKey
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
