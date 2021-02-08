<template>
  <div>
    <div v-show="isVisible">
      <v-row
        no
        no-gutters
      >
        <v-col>
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
        </v-col>
      </v-row>
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

export default {
  emits: ['clear-provision-search-field'],
  components: { QuestionnaireGroup },

  props: {
    expandAllProp: {
      type: Object,
      required: true
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
      flagTimer: null
    }
  },
  computed: {
    expansionPanels: {
      get () {
        let indexes = []
        if (this.expand.value) {
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
      }
    }),
    isVisible () {
      return this.groupCount > 0
    }
  },
  watch: {
    // expandAllProp (value) {
    //   alert('expand')
    //   this.expandPanels(value)
    // },
    readOnlyProp () {
      this.setReadOnly()
    },
    validateProp () {
      this.validateQ()
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
    validateQ () {
      this.$refs.questionGroup.forEach(group => {
        group.resetError()
      })
      if (this.$refs.questionaire_form.validate()) {
        console.log('Attempting to save...')
      }
      this.$store.dispatch('notification/validateQuestions', { displayValidationErrors: true })
    },
    // expandPanels (expand) {
    //   this.panelIndex = null
    //   this.expand = expand
    // },
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
