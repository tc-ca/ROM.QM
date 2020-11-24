<template>
  <questionnaire />
</template>

<script>

import Questionnaire from '../components/questionnaire/questionnaire.vue'

export default {
  components: {
    Questionnaire
  },
  mounted () {
    // subscribe to mutation as a mutation will be called from App.vue when watch property detects a change.
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setQuestionnaire') {
        this.questionnaire = state.questionnaire.questionnaire
      }
    })
  }
}
</script>

<style scoped>
</style>
