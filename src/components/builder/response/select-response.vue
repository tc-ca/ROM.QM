<template>
  <div>
    <v-select
      ref="select"
      v-model="response"
      :items="question.responseOptions"
      item-value="id"
      :item-text="'text.' + lang"
      attach
      :chips="question.isChips"
      :multiple="question.isMultiple"
      outlined
      label="select"
      return-object
      validate-on-blur
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      response: null
    }
  },
  computed: {
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    })
  }
}
</script>

<style scoped>

</style>
