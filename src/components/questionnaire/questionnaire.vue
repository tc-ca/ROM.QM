<template>
  <div>
    <v-row>
      <v-col>
        <v-btn
          @click="expandAll()"
        >
          <span>{{ $t('app.questionnaire.expandAll') }}</span>
        </v-btn>
        <v-btn
          @click="collapseAll()"
        >
          <span>{{ $t('app.questionnaire.collapseAll') }}</span>
        </v-btn>
        <v-btn @click="validateQ()">
          {{ $t('app.questionnaire.validate') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
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
              />
            </v-expansion-panels>
          </v-form>
        </div>
      </v-col>
      <v-col
        v-if="hasNotifications"
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

import QuestionnaireGroup from './group/group.vue'
import QuestionnaireError from './questionnaire-error'
import { buildNotificationObject } from '../../utils'

export default {
  components: { QuestionnaireGroup, QuestionnaireError },

  props: {
  },
  data () {
    return {
      valid: false,
      expand: true,
      panelIndex: Number,
      provisionFilter: null,
      searchInput: null,
      testData: null,
      comboxchanged: false,
      provisionList: []
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
    }
  },
  beforeDestroy () {
    this.$store.dispatch('notification/clearNotifications')
  },
  methods: {
    isDirty () {
      return _.differenceWith(this.group.groups, this.group.groupsCopy, _.isEqual).length !== 0
    },
    onNotificationClick (n) {
      this.expand = true
      // this.panelIndex = n.groupIndex
      this.$store.commit('errors/updateErrorNotification', n.qguid)
    },
    addQuestionNotificationsToList (q, groupIndex, queIndex, depth) {
      if (q.isVisible) {
        if (q.notification) {
          this.$store.dispatch('notification/addNotification', q.notification)
        } else if (!q.validationState || !q.response) {
          q.notification = buildNotificationObject(q, 'A valid response for the question is required.', groupIndex, queIndex, depth, 'mdi-message-draw', this.lang)
          this.$store.dispatch('notification/addNotification', q.notification)
        } else {
          q.responseOptions.forEach(op => {
            if (op.internalComment.notification) {
              this.$store.dispatch('notification/addNotification', op.internalComment.notification)
            } else if (op.internalComment.option === 'required' && op.internalComment.value.trim().length === 0) {
              op.internalComment.notification = buildNotificationObject(q, `Internal Comment for the response type ${op.text[this.lang]} is required.`, groupIndex, queIndex, depth, 'mdi-message-alert', this.lang)
              this.$store.dispatch('notification/addNotification', op.internalComment.notification)
            }
            if (op.externalComment.notification) {
              this.$store.dispatch('notification/addNotification', op.externalComment.notification)
            } else if (op.externalComment.option === 'required' && op.externalComment.value.trim().length === 0) {
              op.externalComment.notification = buildNotificationObject(q, `External Comment for the response type ${op.text[this.lang]} is required.`, groupIndex, queIndex, depth, 'mdi-message-alert', this.lang)
              this.$store.dispatch('notification/addNotification', op.externalComment.notification)
            }
            if (op.picture.notification) {
              this.$store.dispatch('notification/addNotification', op.picture.notification)
            } else if (op.picture.option === 'required' && op.picture.value.trim().length === 0) {
              op.picture.notification = buildNotificationObject(q, `A picture for the response type ${op.text[this.lang]} is required.`, groupIndex, queIndex, depth, 'mdi-image-plus', this.lang)
              this.$store.dispatch('notification/addNotification', op.picture.notification)
            }
          })
        }
        q.childQuestions.forEach(child => {
          this.addQuestionNotificationsToList(child, groupIndex, queIndex, ++depth)
        })
      }
    },
    validateQ () {
      this.$refs.questionGroup.forEach(group => {
        group.resetError()
      })
      this.$store.dispatch('notification/clearNotifications')
      if (this.$refs.questionaire_form.validate()) {
        console.log('Attempting to save...')
      } else {
        console.log(JSON.stringify(this.group.groups))
        let grpIndex = 0

        this.group.groups.forEach(group => {
          let queIndex = 0
          group.questions.forEach(question => {
            this.addQuestionNotificationsToList(question, grpIndex, queIndex, 0)
            queIndex++
          })
          grpIndex++
        })

        console.log(JSON.stringify(this.group.groups))
        // this.$store.dispatch('notification/showNotifications')
        // this.$store.dispatch('notification/show', { text: `There is some responses are missing or incorrect`, color: 'error' })
      }
    },
    collapseAll () {
      this.panelIndex = null
      this.expand = false
    },
    expandAll () {
      this.panelIndex = null
      this.expand = true
    },
    updateProvisionFilter () {
      const provisionFilter = this.provisionFilter
      this.$store.dispatch('UpdateProvisionFilter', { provisionFilter })
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
  .v-expansion-panel {
    max-width: 800px;
  }
}
</style>
