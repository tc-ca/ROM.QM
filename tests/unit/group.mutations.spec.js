
import { mutations } from '../../src/store/modules/group'

describe('Test Group component Vuex Mutations', () => {
  // set initial state, note override if needed in individual tests
  let state
  beforeEach(() => {
    state = {
      groups: [],
      groupsCopy: []
    }
  })

  it('setGroups', () => {
    const groups = [{}, {}]
    mutations.setGroups(state, { groups })
    expect(state.groups.length).toEqual(groups.length)
  })

  it('copyGroups', () => {
    const groupsCopy = [{}, {}]
    mutations.copyGroups(state, { groupsCopy })
    expect(state.groupsCopy.length).toEqual(groupsCopy.length)
  })

  it('UpdateGroupOrder', () => {
    const order = 5
    const group = { order: 0 }

    mutations.UpdateGroupOrder(state, { group, order: order })
    expect(group.order).toEqual(order)
  })

  test('updateGroupHtmlElementId', () => {
    const group = {
      name: 'Group1',
      title: { 'en': 'Group', 'fr': 'Group FR' },
      domSuffix: '',
      htmlElementId: '',
      questions: []
    }
    const domSuffix = '#001'

    mutations.updateGroupHtmlElementId(state, { group, domSuffix })
    expect(group.htmlElementId).toEqual(`${group.name}${domSuffix}`)
  })

  test('repeatGroup', () => {
    const group = {}

    mutations.repeatGroup(state, { copiedGroup: group, insertAt: 0 })
    expect(state.groups.length).toEqual(1)
  })

  it('copy group should be in correct position inserted at', () => {
    state = {
      groups: [
        {
          name: 'Group1',
          title: { 'en': 'Group', 'fr': 'Group FR' },
          isRepeatable: false,
          isVisible: false,
          showKey: '',
          hideKey: '',
          order: 0,
          domSuffix: '#000',
          htmlElementId: 'Group1#000',
          questions: []
        }
      ],
      groupsCopy: []
    }

    // simulate copying of group 1
    const copyOfGroup1 = {
      name: 'Group1',
      title: { 'en': 'Group', 'fr': 'Group FR' },
      isRepeatable: false,
      isVisible: false,
      showKey: '',
      hideKey: '',
      order: 0,
      domSuffix: '#001',
      htmlElementId: 'Group1#001',
      questions: []
    }
    mutations.repeatGroup(state, { copiedGroup: copyOfGroup1, insertAt: 1 })
    const index = state.groups.findIndex(
      x => x.htmlElementId === copyOfGroup1.htmlElementId
    )
    expect(index).toEqual(1)
  })

  it('removeGroup', () => {
    state = {
      groups: [
        {
          name: 'Group1',
          title: { 'en': 'Group', 'fr': 'Group FR' },
          isRepeatable: false,
          isVisible: false,
          showKey: '',
          hideKey: '',
          order: 0,
          domSuffix: '#000',
          htmlElementId: 'Group1#000',
          questions: []
        },
        {
          name: 'Group2',
          title: { 'en': 'Group', 'fr': 'Group FR' },
          isRepeatable: false,
          isVisible: false,
          showKey: '',
          hideKey: '',
          order: 1,
          domSuffix: '#000',
          htmlElementId: 'Group2#000',
          questions: []
        }
      ],
      groupsCopy: []
    }

    const groupToBeRemoved = {
      name: 'Group2',
      title: { 'en': 'Group', 'fr': 'Group FR' },
      isRepeatable: false,
      isVisible: false,
      showKey: '',
      hideKey: '',
      order: 1,
      domSuffix: '#000',
      htmlElementId: 'Group2#000',
      questions: []
    }

    // simulate copying of group 1
    mutations.removeGroup(state, { group: groupToBeRemoved })
    const index = state.groups.findIndex(
      x => x.htmlElementId === groupToBeRemoved.htmlElementId
    )
    expect(index).toEqual(-1)
  })
})
