<template>
  <div>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="2"
        >
          <v-sheet
            rounded="lg"
            min-height="268"
          >
            <!--  -->
          </v-sheet>
        </v-col>

        <v-col
          cols="12"
          sm="8"
        >
          <v-sheet
            class="blue lighten-3"
            min-height="70vh"
            rounded="lg"
          >
            <questionnaire
              ref="questionnaire"
              :expand-all-prop="expandAllPropQuestionnaire"
              :read-only-prop="readOnlyPropQuestionnaire"
              :validate-prop="validatePropQuestionnaire"
              :display-navigation-prop="navigationDisplayPropQuestionnniare"
              :notification:click="onNotificationClick"
              @clear-provision-search-field="onClearProvisionSearchField"
            />
            <questionnaire-error
              :is-visible="validate"
              @notification:click="onNotificationClick"
              @close="validate = false"
            />
          </v-sheet>
        </v-col>

        <v-col
          cols="12"
          sm="2"
        >
          <v-sheet
            rounded="lg"
            min-height="268"
          >
            <!--  -->
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BuilderService from '../services/builderService'
import Questionnaire from '../components/questionnaire/questionnaire.vue'
import QuestionnaireError from '../components/questionnaire/questionnaire-error.vue'

import BaseMixin from '../mixins/base'

export default {
  emits: ['clear-provision-search-field'],
  components: {
    Questionnaire,
    QuestionnaireError
  },
  mixins: [BaseMixin],
  props: {
    expandAllPropQuestionnaire: {
      type: Boolean,
      default: false
    },
    collaspeAllPropQuestionnaire: {
      type: Boolean,
      default: false
    },
    validatePropQuestionnaire: {
      type: Boolean,
      default: false
    },
    readOnlyPropQuestionnaire: {
      type: Boolean,
      default: false
    },
    navigationDisplayPropQuestionnniare: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      validate: false
    }
  },
  watch: {
    validatePropQuestionnaire () {
      // set to true, as it represents user clicking on the button, opens drawer component
      this.validate = true
    }
  },

  async mounted () {
    // if env= dev and loadLocalData then set the questionnaire state to local copy else the state will be set explicility outside in app.vue
    if (this.envDev && this.loadLocalData) {
      var templateToLoad = process.env.VUE_APP_TEMPLATE_TO_LOAD
      const questionnaire = await BuilderService.GetMockQuestionnaireFromImportModule(templateToLoad)
      this.$store.dispatch('SetQuestionnaireState', { questionnaire, page: 'questionnaire' })
    }
    // if env= dev load the provisions else the state will be set explicility outside in app.vue
    if (this.envDev && this.loadLocalData) {
      await this.$store.dispatch('SetFlatLegislationsStateToLocalData')
      await this.$store.dispatch('SetCharacteristicsStateToLocalData')
    }
  },
  methods: {
    onClearProvisionSearchField () {
      this.$emit('clear-provision-search-field')
    },
    onNotificationClick (n) {
      this.expand = true
      this.$store.commit('errors/updateErrorNotification', n.qguid)
      this.validate = false
    }
  }
}
</script>

<style scoped>
</style>
