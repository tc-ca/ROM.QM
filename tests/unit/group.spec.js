import Vuetify from 'vuetify'
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import Group from '../../src/components/questionnaire/group/group.vue'

const vuetify = new Vuetify()
const localVue = createLocalVue()
localVue.use(Vuex)

let group = {
  primaryKey: 'Group 1',
  title: { 'en': 'Group', 'fr': 'Group FR' },
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
  let actions
  let store

  // mock
  beforeEach(() => {
    actions = {
      updateGroupOrder: jest.fn(),
      updateGroupHtmlElementId: jest.fn()
    }

    store = new Vuex.Store({
      actions: actions
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
})
