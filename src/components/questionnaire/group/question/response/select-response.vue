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
                if (!value || (this.question.isMultiple && !value.length)) {
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
        if (!state || !state.app) {
          return 'en'
        }
        return state.app.settings.lang
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

    if (this.question.response != null) {
      if (this.question.isMultiple) {
        this.response = []
        for (let i = 0; i < this.question.response.length; i++) {
          this.response.push(this.question.responseOptions.find(r => r.value === this.question.response[i]))
        }
      } else {
        this.response = this.question.responseOptions.find(r => r.value === this.question.response)
      }

      this.onChange()
    }
  },
  methods: {
    onChange () {
      let args = {
        value: this.question.isMultiple ? this.response.map(item => item.value) : this.response.value
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
