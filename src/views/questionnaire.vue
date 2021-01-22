<template>
  <div>
    <questionnaire
      ref="questionnaire"
      :expand-all-prop="expandAllPropQuestionnaire"
      :read-only-prop="readOnlyPropQuestionnaire"
      :validate-prop="validatePropQuestionnaire"

      @clear-provision-search-field="onClearProvisionSearchField"
    />
  </div>
</template>

<script>
import BuilderService from '../services/builderService'
import Questionnaire from '../components/questionnaire/questionnaire.vue'
import BaseMixin from '../mixins/base'

export default {
  emits: ['clear-provision-search-field'],
  components: {
    Questionnaire
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
    if (this.envDev) {
      await this.$store.dispatch('SetFlatLegislationsStateToLocalData')
      await this.$store.dispatch('SetCharacteristicsStateToLocalData')
    }
  },
  methods: {
    onClearProvisionSearchField () {
      this.$emit('clear-provision-search-field')
    }
  }
}
</script>

<style scoped>
</style>
