<template>
  <div>
    <div
      v-for="(option, indexControl) in question.responseOptions"
      :key="indexControl"
      :class="['qtn-radio-button', option.isProblem ? 'qtn-radio-button-non-compliant':'qtn-radio-button-compliant']"
    >
      <input
        :id="`${group.domSuffix}-${question.id}-${indexControl}`"
        v-model="selectedOption"
        :value="option"
        type="radio"
      >
      <label :for="`${group.domSuffix}-${question.id}-${indexControl}`">{{ option.text[lang] }}</label>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
let unwatch = null

export default {

  props: {
    question: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedOption: null
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
  },

  mounted () {
    // this.watchOptions()
  },
  created () {
    this.sortOptions()
  },
  methods: {
    sortOptions () {
      this.question.responseOptions.sort((a, b) => a.sortOrder - b.sortOrder)
    },
    watchOptions () {
      unwatch = this.$watch('question.responseOptions',
        (oldValue, newValue) => {
          unwatch()
          this.sortOptions()
          this.watchOptions()
        },
        {
          deep: true
        })
    }
  }
}
</script>

<style scoped>

</style>
