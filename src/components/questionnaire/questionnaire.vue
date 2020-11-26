<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-btn
          color="teal"
          fab
          @click="expandAll()"
        >
          <v-icon>mdi-camera-plus-outline</v-icon>
          <span>Expand All</span>
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          color="teal"
          fab
          @click="collapseAll()"
        >
          <v-icon>mdi-camera-plus-outline</v-icon>
          <span>Collapse All</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
        <v-form
          ref="questionaire_form"
          v-model="valid"
        >
          <v-expansion-panels
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
            />
          </v-expansion-panels>
        </v-form>
      </v-col>
      <v-col cols="5">
        <v-row justify="end">
          <v-col class="col-auto">
            <v-btn @click="validateQ()">
              Validate
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import QuestionnaireGroup from './group/group.vue'

// let env = process.env.NODE_ENV || 'development'

export default {
  components: { QuestionnaireGroup },
  data () {
    return {
      valid: false
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
      }
    })
  },
  methods: {
    addQuestionNotificationsToList (q) {
      if (q.notification) {
        this.$store.dispatch('notification/addNotification', q.notification)
      }
      if (!q.validationState || !q.response) {
        q.notification = { text: `A valid response for question ${q.text[this.lang]} is required.`, color: 'error' }
        this.$store.dispatch('notification/addNotification', q.notification)
      }
      if (q.internalComment.notification) {
        this.$store.dispatch('notification/addNotification', q.internalComment.notification)
      } else if (q.internalComment.option === 'required' && q.internalComment.value.trim().length === 0) {
        q.internalComment.notification = { text: `Internal Comment for question ${q.text[this.lang]} is required. Please enter a value on the comment field.`, color: 'error' }
        this.$store.dispatch('notification/addNotification', q.internalComment.notification)
      }
      if (q.externalComment.notification) {
        this.$store.dispatch('notification/addNotification', q.externalComment.notification)
      } else if (q.externalComment.option === 'required' && q.externalComment.value.trim().length === 0) {
        q.externalComment.notification = { text: `External Comment for question ${q.text[this.lang]} is required. Please enter a value on the comment field.`, color: 'error' }
        this.$store.dispatch('notification/addNotification', q.externalComment.notification)
      }
      if (q.picture.notification) {
        this.$store.dispatch('notification/addNotification', q.picture.notification)
      } else if (q.picture.option === 'required' && q.picture.value.trim().length === 0) {
        q.picture.notification = { text: `Picture is required on question ${q.text[this.lang]}, please upload at least one.`, color: 'error' }
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
        console.log(JSON.stringify(this.group.groups))
        this.group.groups.forEach(group => {
          group.questions.forEach(question => {
            this.addQuestionNotificationsToList(question)
          })
        })
        this.$store.dispatch('notification/showNotifications')
        // this.$store.dispatch('notification/show', { text: `There is some responses are missing or incorrect`, color: 'error' })
      }
    },
    collapseAll () {
      alert('collapse')
      // to loop
    },
    expandAll () {
      alert('expand')
      // to loop
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
