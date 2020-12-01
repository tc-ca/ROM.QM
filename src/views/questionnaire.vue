<template>
  <div>
    <questionnaire />
  </div>
</template>

<script>
import Questionnaire from '../components/questionnaire/questionnaire.vue'
const env = process.env.NODE_ENV || 'development'

export default {
  components: {
    Questionnaire
  },
  async mounted () {
    if (env === 'development') {
      await this.$store.dispatch('SetFlatLegislationsStateToLocalData')
      await this.$store.dispatch('SetMockQuestionnaireResponse')
    }
  }
}
</script>

<style scoped>
</style>
