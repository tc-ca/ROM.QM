<template>
  <questionnaire />
</template>

<script>

import Questionnaire from '../components/questionnaire/questionnaire.vue'

export default {
  components: {
    Questionnaire
  },
  data () {
    return {
      provisions: null
    }
  },
  mounted () {
    // subscribe to mutation as a mutation will be called from App.vue when watch property detects a change.
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setQuestionnaire') {
        this.questionnaire = state.questionnaire.questionnaire
      }
      if (mutation.type === 'SetLegislation') {
        this.provisions = this.$store.state.legislations.legislations
      }
    })
  }
}
</script>

<style scoped>
</style>
