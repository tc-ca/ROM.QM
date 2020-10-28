<template>
  <div>
    test: {{ question.validationRules[0] }}

    <pure-text-response :question="question" :lang="en-US" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PureTextResponse from './pure-text-response'

export default {
  components: {
    PureTextResponse
  },

  computed: {
    ...mapState({
      lang: state => {
        if (!state || !state.app) {
          return 'en-US'
        }
        return state.app.settings.lang
      }
    })
  }
}

</script>

<style>

</style>
