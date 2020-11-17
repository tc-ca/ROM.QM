<template>
  <v-row>
    <v-col>
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
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import QuestionnaireGroup from './group/group.vue'
// import questionnaireApi from '../../services/questionnaireService'

// let env = process.env.NODE_ENV || 'development'

export default {
  components: { QuestionnaireGroup },

  props: {
    schema:
    { type: String,
      required: true
    }
  },
  data () {
    return {
      valid: false
    }
  },
  computed:
  {
    ...mapState(['group'])
  },

  watch: {
    schema (value, oldValue) {
      this.$store.dispatch('getQuestionnaireGroups', value)
    }
  },

  created: function () {
    // let docSafetyMark = questionnaireApi.GetQuestionnaireGroups()
    // this.$store.dispatch('setQuestionnaireGroups', docSafetyMark.groups)
    // this.navigateTo('questionnaire')
    this.$store.dispatch('getQuestionnaireGroups', null)
  },
  methods: {
    save () {
      this.$refs.questionGroup.forEach(group => {
        group.resetError()
      })

      if (this.$refs.questionaire_form.validate()) {
        // console.log('saving...')
      } else {
        this.$store.dispatch('notification/show', { text: `There is some responses are missing or incorect`, color: 'error' })
      }
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
