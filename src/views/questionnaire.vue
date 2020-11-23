<template>
  <questionnaire
    ref="questionnaire"
    :templatejson="'test'"
    :templateid="''"
  />
</template>

<script>
// TODO: figure out this usage for :templatejson

import Questionnaire from '../components/questionnaire/questionnaire.vue'

export default {
  components: {
    Questionnaire
  },
  props: {
    templatejson: {
      type: String,
      default: ''
    },
    templateid: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
</style>
