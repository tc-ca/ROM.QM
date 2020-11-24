<template>
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
</template>

<script>
import { mapState } from 'vuex'
import QuestionnaireGroup from './group/group.vue'

// let env = process.env.NODE_ENV || 'development'

export default {
  components: { QuestionnaireGroup },

  props: {
    templatejson:
    { type: String,
      required: true
    },
    templateid:
    {
      type: String,
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
  methods: {
    validateQ () {
      this.$refs.questionGroup.forEach(group => {
        group.resetError()
      })
      alert('LM-Test')
      if (this.$refs.questionaire_form.validate()) {
        console.log('Attempting to save...')
      } else {
        let q = this.$store.getters['getQuestionnaire']
        console.log(JSON.stringify(q))
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
