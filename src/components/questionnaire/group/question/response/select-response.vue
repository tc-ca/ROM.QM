<template>
  <div class="mt-4">
    <v-select
      ref="select"
      v-model="response"
      :items="question.responseOptions"
      item-value="id"
      :item-text="'text.' + lang"
      attach
      :chips="question.isChips"
      multiple
      outlined
      :disabled="readOnly"
      label="select"
      return-object
      validate-on-blur
      :rules="[validationRule]"
      @change="onChange($event, $event)"
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
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      response: null,
      validationRule:
        value => {
          if (this.question.isVisible) {
            for (let i = 0; i < this.question.validationRules.length; i++) {
              let ruleDefinition = this.question.validationRules[i]
              if (!ruleDefinition.enabled) {
                continue
              }
              let errorMessage = ruleDefinition.errorMessage[this.lang]

              if (ruleDefinition.type === 'require') {
                if (!value || (!value.length)) {
                  return errorMessage
                }
              } else if (ruleDefinition.type === 'minLength') {
                if (value.length < ruleDefinition.value) {
                  return errorMessage.replace('{0}', ruleDefinition.value)
                }
              } else if (ruleDefinition.type === 'maxLength') {
                if (value.length > ruleDefinition.value) {
                  return errorMessage.replace('{0}', ruleDefinition.value)
                }
              }
            }
          }
          return true
        }

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
    this.$watch(
      '$refs.select.validations',
      (newValue) => {
        let error = this.$refs.select.validations.length > 0
        this.onError(error)
      }
    )

    if (this.question.result && this.question.result.responses.length > 0) {
      this.response = []
      for (let i = 0; i < this.question.result.responses.length; i++) {
        this.response.push(this.question.responseOptions.find(r => r.value === this.question.result.responses[i].value))
      }

      this.onChange()
    }
  },
  methods: {
    onChange () {
      let args = {
        value: this.response.map(item => item.value)
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
