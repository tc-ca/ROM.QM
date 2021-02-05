<template>
  <div>
    <div v-show="isVisible">
      <v-row>
        <v-col>
          <div>
            <v-form
              ref="questionaire_form"
              v-model="valid"
              justify="start"
            >
              <v-expansion-panels
                v-model="expansionPanels"
                focusable
                multiple
                class="v-expansion-panel"
              >
                <questionnaire-group
                  v-for="(group, groupIndex) in group.groups"
                  ref="questionGroup"
                  :key="groupIndex"
                  :group="group"
                  :index="groupIndex"
                  :expand="expand"
                  :read-only="readOnly"
                  data-group-id="group"
                  @update-group-count="onUpdateGroupCount"
                />
              </v-expansion-panels>
            </v-form>
          </div>
        </v-col>
        <v-col
          v-if="hasNotifications && displayValidationErrors"
          cols="5"
          justify="space-around"
        >
          <v-row>
            <v-col>
              <div style="position: fixed;left: 60%;top: 10%; width: 35%;max-height:75%;overflow-y: auto;">
                <questionnaire-error
                  :notifications="notifications"
                  @notification:click="onNotificationClick"
                />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <questionnaire-nav
        :display="drawer"
        :navitems="navItems"
        @question:click="onQuestionClick"
        @navigation-close="drawer = $event"
      />
    </div>
    <div v-show="!isVisible">
      <v-card
        elevation="2"
      >
        <v-card-title>
          Sorry, no questions matching the provision search criteria.
        </v-card-title>
        <v-card-text>
          <p>Search Suggestions</p>
          <div class="text--primary">
            <ul>
              <li>
                Check your spelling
              </li>
              <li>
                Try more general words
              </li>
              <li>
                Search by provision label (Example: "3.5 (1) (c)")
              </li>
              <li>
                Select a provision from the list of suggestions
              </li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="clearProvisionSearchField">
            Clear Search
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

import QuestionnaireGroup from './group/group.vue'
import QuestionnaireError from './questionnaire-error'
import QuestionnaireNav from '../questionnaire-nav/questionnaire-nav.vue'

export default {
  emits: ['clear-provision-search-field'],
  components: { QuestionnaireGroup, QuestionnaireError, QuestionnaireNav },

  props: {
    expandAllProp: {
      type: Boolean,
      default: true
    },
    validateProp: {
      type: Boolean,
      default: false
    },
    readOnlyProp: {
      type: Boolean,
      default: false
    },
    displayNavigationProp: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      valid: false,
      expand: this.expandAllProp,
      panelIndex: Number,
      groupCount: 0,
      readOnly: this.readOnlyProp,
      drawer: false,
      navItems: [],
      flagTimer: null
    }
  },
  computed: {
    expansionPanels: {
      get () {
        let indexes = []
        if (this.expand) {
          for (let i = 0; i < this.group.groups.length; i++) {
            indexes.push(i)
          }
          return indexes
        } else if (this.panelIndex != null) {
          indexes.push(this.panelIndex)
          return indexes
        } else {
          return []
        }
      },
      set () {}
    },
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      },
      group: state => {
        return state.group
      },
      displayValidationErrors: state => {
        return state.notification.displayValidationErrors
      },
      searchableProvisions: state => {
        if ((state.questionnaire.questionnaire === null) || (state.legislations.legislations === null)) {
          return []
        }
        const searchableProvisions = state.questionnaire.questionnaire.searchableProvisions
        let dictionnairyOfProvisions = state.legislations.legislations
        let provisions = []

        searchableProvisions.forEach(x => {
          const hydratedItem = dictionnairyOfProvisions[x.leg]
          const newProvision = { ...x, ...hydratedItem }
          provisions.push(newProvision)
        })

        return provisions
      }
    }),
    hasNotifications () {
      return this.$store.getters['notification/hasNotifications']
    },
    notifications () {
      const notices = (this.hasNotifications) ? this.$store.getters['notification/getNotifications'] : []
      return notices
    },
    isVisible () {
      return this.groupCount > 0
    }
  },
  watch: {
    expandAllProp (value) {
      this.expandPanels(value)
    },
    readOnlyProp () {
      this.setReadOnly()
    },
    validateProp () {
      this.validateQ()
    },
    displayNavigationProp () {
      this.displayNavigationDrawer()
    }
  },
  mounted () {
    // sets the default value based on visibility of the component
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      if (this.$refs.questionGroup) {
        this.groupCount = this.$refs.questionGroup.filter(x => x.isVisible === true).length
      }
    })
    this.isDirty()
  },
  updated () {
    this.readOnly = this.$store.getters['getQuestionnaireReadOnlyStatus']
  },
  beforeDestroy () {
    this.$store.dispatch('notification/clearNotifications')
    this.$store.dispatch('setQuestionnaireReadOnlyStatus', this.readOnly)
  },
  methods: {
    displayNavigationDrawer () {
      let a = JSON.stringify(this.group.groups)
      let b = a.replaceAll('primaryKey', 'id')
        .replaceAll('"questions":', '"children":')
        .replaceAll('"childQuestions":', '"children":')
        .replaceAll('"name":', '"name_o":')
        .replaceAll('"text":', '"name":')
        .replaceAll('"title":', '"name":')
      const regex = /("name":{"en":([^}]+)"fr":([^}]+)})/ig
      const regex1 = /("name":{"en":([^}]+)"fr":([^}]+)})/i

      let r = b.match(regex)
      r.forEach(i => {
        let en = '"name":' + i.match(/"en":"([^"]+)"/ig)[0].replaceAll('"en":', '')
        let fr = '"name":' + i.match(/"fr":"([^"]+)"/ig)[0].replaceAll('"fr":', '')
        b = b.replace(regex1, this.lang === 'en' ? en : fr)
      })
      this.$vuetify.goTo(0)
      this.navItems = JSON.parse(b)
      this.drawer = true
    },
    setReadOnly () {
      this.readOnly = this.$store.getters['getQuestionnaireReadOnlyStatus']
      this.readOnly = !this.readOnly
      this.$store.dispatch('setQuestionnaireReadOnlyStatus', this.readOnly)
    },
    isDirty () {
      let curGroups = []
      let copyGroups = []
      var model = { questions: null, title: null }
      this.group.groups.forEach(g => {
        curGroups.push(_.pick(g, _.keys(model)))
      })
      this.group.groupsCopy.forEach(g => {
        copyGroups.push(_.pick(g, _.keys(model)))
      })

      this.$root.$children[0].isFormDirty = _.differenceWith(curGroups, copyGroups, _.isEqual).length !== 0

      this.flagTimer = setTimeout(() => this.isDirty(), 3000)
      if (this.$root.$children[0].isFormDirty) clearTimeout(this.flagTimer)
    },
    onNotificationClick (n) {
      this.expand = true
      this.$store.commit('errors/updateErrorNotification', n.qguid)
    },
    onQuestionClick (q) {
      if (q.guid === undefined) return
      this.expand = true
      this.drawer = false
      this.$store.commit('errors/updateErrorNotification', q.guid)
    },
    validateQ () {
      this.$refs.questionGroup.forEach(group => {
        group.resetError()
      })
      if (this.$refs.questionaire_form.validate()) {
        console.log('Attempting to save...')
      }
      this.$store.dispatch('notification/validateQuestions', { displayValidationErrors: true })
    },
    expandPanels (expand) {
      this.panelIndex = null
      this.expand = expand
    },
    onUpdateGroupCount () {
      if (this.$refs.questionGroup) {
        this.groupCount = this.$refs.questionGroup.filter(x => x.isVisible === true).length
      }
    },
    clearProvisionSearchField () {
      this.$emit('clear-provision-search-field')
    }
  }
}
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  .v-expansion-panel::before {
    box-shadow: none;
  }
}
 @media only screen and (min-width: 601px) {

}

.center {
  position: fixed;
  top: 50%;
  left: -4%;
  width: 115px;
  height: 0px;
  text-align: right;
  z-index: 9999;
  margin-top: -15px;
  transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
}

.center v-btn {
  transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
  background: #06c;
  text-align:center;
  height: 15px;
  width: 165px;
  padding: 8px 16px;
  color: #fff;
  font-family: Arial, sans-serif;
  font-size: 17px;
  font-weight: bold;
  text-decoration: none;
  border-bottom: solid 1px #333;
  border-left: solid 1px #333;
  border-right: solid 1px #fff;
}

.center a:hover {
  background: #CCC
}
</style>
