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
import QuestionnaireGroup from './group/group.vue'
import QuestionnaireError from './questionnaire-error'
import { buildNotificationObject } from '../../utils'

export default {
  components: { QuestionnaireGroup, QuestionnaireError },

  props: {
    templatejson:
    {
      type: String,
      required: false,
      default: ''
    },
    templateid:
    {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      valid: false,
      expand: true,
      panelIndex: Number
    }
  },
  computed: {
    ...mapState(['group']),
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      },
      expansionPanels () {
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
    onNotificationClick (n) {
      /* eslint-disable no-debugger */
      // debugger
      this.expand = false
      this.panelIndex = n.groupIndex
      this.$refs.questionGroup[n.groupIndex].$refs.groupQuestion.forEach((g, i) => {
        g.$refs.qPanel.isActive = (i === n.questionId)
      })
    },
    addQuestionNotificationsToList (q, groupIndex, queIndex, depth) {
      /* eslint-disable no-debugger */
      // debugger
      if (q.notification) {
        this.$store.dispatch('notification/addNotification', q.notification)
      } else if (!q.validationState || !q.response) {
        q.notification = buildNotificationObject(q, 'A valid response for the question is required.', groupIndex, queIndex, depth, 'mdi-message-draw', this.lang)
        this.$store.dispatch('notification/addNotification', q.notification)
      }
      if (q.internalComment.notification) {
        this.$store.dispatch('notification/addNotification', q.internalComment.notification)
      } else if (q.internalComment.option === 'required' && q.internalComment.value.trim().length === 0) {
        q.internalComment.notification = buildNotificationObject(q, 'Internal Comment for the question is required. Please enter a value on the comment field.', groupIndex, queIndex, depth, 'mdi-message-alert', this.lang)
        this.$store.dispatch('notification/addNotification', q.internalComment.notification)
      }
      if (q.externalComment.notification) {
        this.$store.dispatch('notification/addNotification', q.externalComment.notification)
      } else if (q.externalComment.option === 'required' && q.externalComment.value.trim().length === 0) {
        q.externalComment.notification = buildNotificationObject(q, 'External Comment for the question is required. Please enter a value on the comment field.', groupIndex, queIndex, depth, 'mdi-message-alert', this.lang)
        this.$store.dispatch('notification/addNotification', q.externalComment.notification)
      }
      if (q.picture.notification) {
        this.$store.dispatch('notification/addNotification', q.picture.notification)
      } else if (q.picture.option === 'required' && q.picture.value.trim().length === 0) {
        q.picture.notification = buildNotificationObject(q, 'A picture is required for this question. Please upload at least one.', groupIndex, queIndex, depth, 'mdi-image-plus', this.lang)
        this.$store.dispatch('notification/addNotification', q.picture.notification)
      }
      q.childQuestions.forEach(child => {
        this.addQuestionNotificationsToList(child, groupIndex, queIndex, ++depth)
      })
    },
    validateQ () {
      /* eslint-disable no-debugger */
      // debugger
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
