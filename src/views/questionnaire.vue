<template>
  <questionnaire
    ref="questionnaire"
    :schema="'test'"
  />
</template>

<script>
// TODO: figure out this usage for :schema

import Questionnaire from '../components/questionnaire/questionnaire.vue'

export default {
  components: {
    Questionnaire
  },
  props: {
    schema: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
