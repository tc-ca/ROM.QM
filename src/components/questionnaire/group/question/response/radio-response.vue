<template>
  <div>
    <div
      v-for="(option, indexControl) in question.responseOptions"
      :key="indexControl"
      :class="['qtn-radio-button', isViolation ? 'qtn-radio-button-non-compliant':'qtn-radio-button-compliant']"
    >
      <input
        :id="`${group.domSuffix}-${question.guid}-${indexControl}`"
        v-model="selectedOption"
        :disabled="readOnly"
        :value="option"
        type="radio"
        @change="onChange"
      >
      <label :for="`${group.domSuffix}-${question.guid}-${indexControl}`">{{ option.text[lang] }}</label>
    </div>
    <v-input
      ref="validationControl"
      v-model="selectedOption"
      :disabled="readOnly"
      :rules="validationRulesFuncs"
      @update:error="onError"
    />
    <v-dialog
      v-model="confirmDialogOpen"
      max-width="400"
    >
      <v-card>
        <v-card-title>
          {{ $t('app.questionnaire.group.question.continue') }}
        </v-card-title>
        <v-card-text>
          {{ $t('app.questionnaire.group.question.unselectProvisions') }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            text
            @click="confirmed()"
          >
            {{ $t('app.questionnaire.group.question.ok') }}
          </v-btn>

          <v-btn
            text
            @click="cancel()"
          >
            {{ $t('app.questionnaire.group.question.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  events: ['change'],
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
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      selectedOption: null,
      selOldOption: null,
      confirmDialogOpen: false,
      validationRulesFuncs: [
        value => {
          if (this.question.isVisibleByDefault) {
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
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    }),
    previousValue () {
      return this.selOldOption !== null ? this.selOldOption.value : this.selectedOption.value
    },
    currentValue () {
      return this.selectedOption.value
    },
    currentId () {
      return this.selectedOption.id
    },
    previousId () {
      return this.selOldOption !== null ? this.selOldOption.id : this.selectedOption.id
    },
    isViolation () {
      if (!this.selectedOption) {
        return false
      }
      return this.selectedOption.provisions.length > 0
    }
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
      this.selOldOption = this.selectedOption
      this.onChange(this.selectedOption, true)
    }
  },
  methods: {
    onChange (e, flag) {
      if (this.question.responseOptions.length > 0) {
        let rs = this.question.responseOptions.find(q => q.id === this.previousId)
        // if user changes option
        // and if option has provisions asscoiated to it
        // notify the user of possible lost changes
        // flag bool to prevent notification from pop up on load
        if (this.previousId !== this.currentId && rs.selectedProvisions.length > 0 && !flag) {
          this.confirmDialogOpen = true
        } else {
          this.processEvent()
        }
      } else {
        this.processEvent()
      }
    },
    processEvent () {
      let args = {
        optionCurrentId: this.currentId,
        optionPreviousId: this.previousId,
        value: this.currentValue,
        preValue: this.previousValue
      }
      this.$emit('change', args)
      this.selOldOption = this.selectedOption
    },
    confirmed () {
      this.confirmDialogOpen = false

      // Clear the previuosly selected provisions
      // let preValue = this.selOldOption == null ? null : this.selOldOption.value
      // let rs = this.question.responseOptions.find(q => q.value === preValue)
      // if (rs != null && rs.selectedProvisions.length > 0) {
      //   rs.selectedProvisions = null
      // }

      this.processEvent()
    },
    cancel () {
      this.confirmDialogOpen = false
      this.selectedOption = this.question.responseOptions.find(r => r.value === this.question.response)
    },
    onError (error) {
      this.$emit('error', error)
    }
  }
}
</script>

<style scoped>

</style>
