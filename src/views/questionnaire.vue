<template>
  <questionnaire
    ref="questionnaire"
    :templatejson="'test'"
    :templateid="'893bcfb7-49f1-4c2f-8cf5-a412893fb229'"
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
      default: '893bcfb7-49f1-4c2f-8cf5-a412893fb229'
    }
  }
}
</script>

<style scoped>

</style>
