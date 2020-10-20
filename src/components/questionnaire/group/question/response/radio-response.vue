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
        @change="onChange"
      >
      <label :for="`${group.domSuffix}-${question.id}-${indexControl}`">{{ option.text[lang] }}</label>
    </div>
    <v-input
      ref="validationControl"
      v-model="selectedOption"
      :rules="validationRulesFuncs"
      @update:error="onError"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

  props: {
    question: {
      type: Object,
      required: true,
      default: function () {
        return {}
      }
    },
    group: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedOption: null,
      validationRulesFuncs: [
        value => {
          if (this.question.isVisible) {
            for (let i = 0; i < this.question.validationRules.length; i++) {
              let ruleDefinition = this.question.validationRules[i]
              let errorMessage = ruleDefinition.errorMessage[this.lang]
              if (!ruleDefinition.enabled) {
                continue
              }
              if (ruleDefinition.type === 'require') {
                if (!value) {
                  return errorMessage
                }
              }
            }
          }
          return true
        }
      ]

    }
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
  },
  created () {
    // this.question.responseOptions.sort((a, b) => a.sortOrder - b.sortOrder)
  },
  mounted () {
    this.$watch(
      '$refs.validationControl.validations.length',
      (newValue) => {
        this.onError(!!newValue)
      }
    )

    if (this.question.response != null) {
      this.selectedOption = this.question.responseOptions.find(r => r.value === this.question.response)
      this.onChange(this.selectedOption)
    }
  },
  methods: {
    onChange (value) {
      let args = {
        value: this.selectedOption.value
      }
      this.$emit('change', args)
    },
    onError (error) {
      this.$emit('error', error)
    }
  }
}
</script>

<style scoped>

</style>
