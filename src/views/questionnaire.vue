<template>
  <div>
    <questionnaire ref="questionnaire" />
  </div>
</template>

<script>
import Questionnaire from '../components/questionnaire/questionnaire.vue'
import BaseMixin from '../mixins/base'

export default {
  components: {
    Questionnaire
  },
  mixins: [BaseMixin],
  async mounted () {
    if (this.loadLocalData) {
      await this.$store.dispatch('SetFlatLegislationsStateToLocalData')
    }
  }
}
</script>

<style scoped>
</style>
