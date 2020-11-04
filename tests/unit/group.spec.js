import Vuetify from 'vuetify'

import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import Group from '../../src/components/questionnaire/group/group.vue'
import { mutations, actions } from '../../src/store/modules/group'

const vuetify = new Vuetify()
const localVue = createLocalVue()
localVue.use(Vuex)

let group = {
  primaryKey: 'Group 1',
  title: { 'en-US': 'Group', 'fr-FR': 'Group FR' },
  isRepeatable: false,
  isVisible: false,
  showKey: '', // TODO: do we need this
  hideKey: '', // TODO: do we need this
  order: 0,
  domSuffix: '#000', // i.e #000
  htmlElementId: '#000', // FIXME: still think we need this
  questions: []
}

describe('Group.vue', () => {
  let localActions
  let store
  let getters

  beforeEach(() => {
    getters = {
      getTargetedRepeatedGroups: () => group
    }

    localActions = {
      updateGroupOrder: jest.fn(),
      updateGroupHtmlElementId: jest.fn()
    }

    store = new Vuex.Store({
      getters,
      actions: localActions
    })
  })

  // it('by default the intial group should not be considered a copy', async () => {
  //   group.isRepeatable = true
  //   group.domSuffix = '#000'

  //   // mounts the component and gives usus access to functions that will help us to test function
  //   const wrapper = mount(Group, {
  //     propsData: { group, index: group.order },
  //     computed: {
  //       repeatGroupTextDifferentiator: () => ''
  //     },
  //     vuetify,
  //     store,
  //     localVue
  //   })
  //   // must await until the dom has our element
  //   await wrapper.vm.$nextTick
  //   expect(wrapper.findComponent('[data-testid="repeatGroup"]').isVisible()).toBe(
  //     true
  //   )
  // })

  it('renders group repeat button when group is set to be repeatable and the group is original', async () => {
    group.isRepeatable = true
    group.domSuffix = '#000'

    // mounts the component and gives usus access to functions that will help us to test function
    const wrapper = mount(Group, {
      propsData: { group, index: group.order },
      computed: {
        repeatGroupTextDifferentiator: () => ''
      },
      vuetify,
      store,
      localVue
    })
    // must await until the dom has our element
    await wrapper.vm.$nextTick
    expect(
      wrapper.find('[data-testid="repeatGroup"]').isVisible()
    ).toBe(true)
  })

  it('renders group repeat button when group is set to be repeatable and the group is a copy', async () => {
    group.isRepeatable = true
    group.domSuffix = '#001'
    // mounts the component and gives usus access to functions that will help us to test function
    const wrapper = mount(Group, {
      propsData: { group, index: group.order },
      computed: {
        repeatGroupTextDifferentiator: () => ''
      },
      vuetify,
      store,
      localVue
    })
    // must await until the dom has our element
    await wrapper.vm.$nextTick
    expect(
      wrapper.find('[data-testid="repeatGroup"]').isVisible()
    ).toBe(true)
  })

  it('does not render group repeat button when group is not repeatable', async () => {
    group.isRepeatable = false

    const wrapper = mount(Group, {
      propsData: { group, index: group.order },
      computed: {
        repeatGroupTextDifferentiator: () => ''
      },
      vuetify,
      store,
      localVue
    })

    await wrapper.vm.$nextTick
    expect(
      wrapper.findAll('[data-testid="repeatGroup"]').length
    ).toEqual(0)
  })

  it('does render remove group button when group is a copied version of the original ', async () => {
    group.isRepeatable = true
    group.domSuffix = '#001'

    const wrapper = mount(Group, {
      propsData: { group, index: group.order },
      computed: {
        repeatGroupTextDifferentiator: () => ''
      },
      vuetify,
      store,
      localVue
    })

    await wrapper.vm.$nextTick

    expect(
      wrapper.findAll('[data-testid="removeGroup"]').length
    ).toEqual(1)
  })

  it('does not render group remove button when group is not repeatable ', async () => {
    group.isRepeatable = false

    const wrapper = mount(Group, {
      propsData: { group, index: group.order },
      computed: {
        repeatGroupTextDifferentiator: () => ''
      },
      vuetify,
      store,
      localVue
    })

    await wrapper.vm.$nextTick

    expect(
      wrapper.findAll('[data-testid="removeGroup"]').length
    ).toEqual(0)
  })

  it('does not render remove group button when group is repeatable and the group is the original ', async () => {
    group.isRepeatable = true
    group.domSuffix = '#000'

    const wrapper = mount(Group, {
      propsData: { group, index: group.order },
      computed: {
        repeatGroupTextDifferentiator: () => ''
      },
      vuetify,
      store,
      localVue
    })

    await wrapper.vm.$nextTick

    expect(
      wrapper.findAll('[data-testid="removeGroup"]').length
    ).toEqual(0)
  })

  // it('emits an event when repeat group button is clicked', async () => {
  //   group.isRepeatable = true
  //   group.domSuffix = '#000'

  //   const wrapper = mount(Group, {
  //     propsData: { group, index: group.order },
  //     computed: {
  //       repeatGroupTextDifferentiator: () => ''
  //     },
  //     vuetify,
  //     store,
  //     localVue
  //   })

  //   wrapper.find('[data-testid="repeatGroup"]').trigger('click')
  //   console.log('events', state.groups.length)

  //   // await wrapper.vm.$nextTick

  //   expect(wrapper.findAll('[data-testid="removeGroup"]').length).toEqual(0)
  // })

  // TESTING MUTATIONS

  it('setGroups', () => {
    const state = {
      groups: [],
      groupsCopy: []
    }
    const groups = [{}, {}]
    mutations.setGroups(state, { groups: groups })
    expect(state.groups.length).toEqual(groups.length)
  })

  it('copyGroups', () => {
    const state = {
      groups: [],
      groupsCopy: []
    }
    const groupsCopy = [{}, {}]
    mutations.copyGroups(state, { groupsCopy })
    expect(state.groupsCopy.length).toEqual(groupsCopy.length)
  })

  it('UpdateGroupOrder', () => {
    const state = {
      groups: [],
      groupsCopy: []
    }
    const order = 5
    mutations.UpdateGroupOrder(state, { group, order: order })
    expect(group.order).toEqual(order)
  })

  test('updateGroupHtmlElementId', () => {
    const state = {
      groups: [],
      groupsCopy: []
    }
    const group = {
      primaryKey: 'Group1',
      title: { 'en-US': 'Group', 'fr-FR': 'Group FR' },
      domSuffix: '',
      htmlElementId: '',
      questions: []
    }
    const domSuffix = '#001'

    mutations.updateGroupHtmlElementId(state, { group, domSuffix })

    expect(group.htmlElementId).toEqual(`${group.primaryKey}${domSuffix}`)
  })

  test('repeatGroup', () => {
    const state = { groups: [], groupsCopy: [] }
    mutations.repeatGroup(state, { copiedGroup: group, insertAt: 0 })
    expect(state.groups.length).toEqual(1)
  })

  it('copy group should be in correct position inserted at', () => {
    const state = {
      groups: [
        {
          primaryKey: 'Group1',
          title: { 'en-US': 'Group', 'fr-FR': 'Group FR' },
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
      primaryKey: 'Group1',
      title: { 'en-US': 'Group', 'fr-FR': 'Group FR' },
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
    const state = {
      groups: [
        {
          primaryKey: 'Group1',
          title: { 'en-US': 'Group', 'fr-FR': 'Group FR' },
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
          primaryKey: 'Group2',
          title: { 'en-US': 'Group', 'fr-FR': 'Group FR' },
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
      primaryKey: 'Group2',
      title: { 'en-US': 'Group', 'fr-FR': 'Group FR' },
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
    console.log(JSON.stringify(groupToBeRemoved, null, 2))
    expect(index).toEqual(-1)
  })
})
