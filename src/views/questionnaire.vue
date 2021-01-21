<template>
  <div>
    <questionnaire
      ref="questionnaire"
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

  async mounted () {
    // if env= dev and loadLocalData then set the questionnaire state to local copy else the state will be set explicility outside in app.vue
    if (this.envDev && this.loadLocalData) {
      const questionnaire = await BuilderService.GetMockQuestionnaireFromImportModule()
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
