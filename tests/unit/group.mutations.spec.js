
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

  test('UPDATE_GROUP_DOM_ID', () => {
    const group = {
      name: 'Group1',
      title: { en: 'Group', fr: 'Group FR' },
      domSuffix: '',
      domId: '',
      questions: []
    }
    const domSuffix = '#001'

    mutations.UPDATE_GROUP_DOM_ID(state, { group, domSuffix })
    expect(group.domId).toEqual(`${group.name}${domSuffix}`)
  })

  test('repeatGroup', () => {
    const group = {
      name: 'Group1',
      title: { en: 'Group', fr: 'Group FR' },
      isRepeatable: false,
      isVisible: false,
      showKey: '',
      hideKey: '',
      sortOrder: 0,
      domSuffix: '#000',
      domId: 'Group1#000',
      questions: []
    }
    const groups = [
      {
        name: 'Group1',
        title: { 'en': 'Group', 'fr': 'Group FR' },
        isRepeatable: false,
        isVisible: false,
        showKey: '',
        hideKey: '',
        sortOrder: 0,
        domSuffix: '#000',
        domId: 'Group1#000',
        questions: []
      }
    ]

    state.groups = groups
    mutations.repeatGroup(state, { copiedGroup: group, insertAt: 1, groups: groups })
    expect(state.groups.length).toEqual(2)
    expect(state.groups[1].domSuffix).toEqual('#001')
    expect(state.groups[1].sortOrder).toEqual(1)
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
          sortOrder: 0,
          domSuffix: '#000',
          domId: 'Group1#000',
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
      sortOrder: 0,
      domSuffix: '#001',
      domId: 'Group1#001',
      questions: []
    }
    mutations.repeatGroup(state, { copiedGroup: copyOfGroup1, insertAt: 1, groups: state.groups })
    const index = state.groups.findIndex(
      x => x.domId === copyOfGroup1.domId
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
          sortOrder: 0,
          domSuffix: '#000',
          domId: 'Group1#000',
          questions: []
        },
        {
          name: 'Group2',
          title: { 'en': 'Group', 'fr': 'Group FR' },
          isRepeatable: false,
          isVisible: false,
          showKey: '',
          hideKey: '',
          sortOrder: 1,
          domSuffix: '#000',
          domId: 'Group2#000',
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
      sortOrder: 1,
      domSuffix: '#000',
      domId: 'Group2#000',
      questions: []
    }

    // simulate copying of group 1
    mutations.removeGroup(state, { group: groupToBeRemoved, groups: state.groups })
    const index = state.groups.findIndex(
      x => x.domId === groupToBeRemoved.domId
    )
    expect(index).toEqual(-1)
  })
})
