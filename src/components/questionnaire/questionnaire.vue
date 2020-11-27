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
            />
          </v-expansion-panels>
        </v-form>
      </v-col>
    </v-row>
    <v-row
      v-if="hasNotifications"
      justify="space-around"
    >
      <questionnaire-error :notifications="notifications" />
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import QuestionnaireGroup from './group/group.vue'
import QuestionnaireError from './questionnaire-error'
import { buildNotificationObject } from '../../utils'

// let env = process.env.NODE_ENV || 'development'

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
      expand: true
    }
  },
  computed: {
    ...mapState(['group']),
    ...mapState({
      lang: state => {
        if (!state || !state.app) {
          return 'en'
        }
        return state.app.settings.lang
      },
      expansionPanels () {
        if (this.expand) {
          let indexes = []
          for (let i = 0; i < this.group.groups.length; i++) {
            indexes.push(i)
          }
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
  methods: {
    addQuestionNotificationsToList (q) {
      if (q.notification) {
        this.$store.dispatch('notification/addNotification', q.notification)
      } else if (!q.validationState || !q.response) {
        q.notification = buildNotificationObject(q, 'A valid response for the question is required.', 'mdi-message-draw', this.lang)
        this.$store.dispatch('notification/addNotification', q.notification)
      }
      if (q.internalComment.notification) {
        this.$store.dispatch('notification/addNotification', q.internalComment.notification)
      } else if (q.internalComment.option === 'required' && q.internalComment.value.trim().length === 0) {
        q.internalComment.notification = buildNotificationObject(q, 'Internal Comment for the question is required. Please enter a value on the comment field.', 'mdi-message-alert', this.lang)
        this.$store.dispatch('notification/addNotification', q.internalComment.notification)
      }
      if (q.externalComment.notification) {
        this.$store.dispatch('notification/addNotification', q.externalComment.notification)
      } else if (q.externalComment.option === 'required' && q.externalComment.value.trim().length === 0) {
        q.externalComment.notification = buildNotificationObject(q, 'External Comment for the question is required. Please enter a value on the comment field.', 'mdi-message-alert', this.lang)
        this.$store.dispatch('notification/addNotification', q.externalComment.notification)
      }
      if (q.picture.notification) {
        this.$store.dispatch('notification/addNotification', q.picture.notification)
      } else if (q.picture.option === 'required' && q.picture.value.trim().length === 0) {
        q.picture.notification = buildNotificationObject(q, 'A picture is required for this question. Please upload at least one.', 'mdi-image-plus', this.lang)
        this.$store.dispatch('notification/addNotification', q.picture.notification)
      }
      q.childQuestions.forEach(child => {
        this.addQuestionNotificationsToList(child)
      })
    },
    validateQ () {
      this.$refs.questionGroup.forEach(group => {
        group.resetError()
      })
      this.$store.dispatch('notification/clearNotifications')
      if (this.$refs.questionaire_form.validate()) {
        console.log('Attempting to save...')
      } else {
        // console.log(JSON.stringify(this.group.groups))
        this.group.groups.forEach(group => {
          group.questions.forEach(question => {
            this.addQuestionNotificationsToList(question)
          })
        })
        console.log(JSON.stringify(this.group.groups))
        // this.$store.dispatch('notification/showNotifications')
        // this.$store.dispatch('notification/show', { text: `There is some responses are missing or incorrect`, color: 'error' })
      }
    },
    collapseAll () {
      this.expand = false
    },
    expandAll () {
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
