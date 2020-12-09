<template>
  <div>
    <v-text-field
      ref="question.samplingRecord.aproximateTotal"
      v-model.number="question.samplingRecord.aproximateTotal"
      :label="$t('app.questionnaire.group.question.sampling.approximateTotal')"
      :hint="$t('app.questionnaire.group.question.sampling.approximateTotalPlaceholder')"
      clearable
      outlined
      type="number"
      min="1"
      :error-messages="errorMessagesTotal"
      :rules="[validateSamplingTotal, validateFullValues]"
    />
    <v-text-field
      ref="question.samplingRecord.sampleSize"
      v-model.number="question.samplingRecord.sampleSize"
      :label="$t('app.questionnaire.group.question.sampling.sampleSize')"
      :hint="$t('app.questionnaire.group.question.sampling.sampleSizePlaceholder')"
      clearable
      outlined
      type="number"
      min="1"
      :error-messages="errorMessagesSize"
      :rules="[validateSamplingSize, validateFullValues]"
    />
    <v-text-field
      ref="question.samplingRecord.nonCompliances"
      v-model.number="question.samplingRecord.nonCompliances"
      :label="$t('app.questionnaire.group.question.sampling.nonCompliances')"
      :hint="$t('app.questionnaire.group.question.sampling.nonCompliancesPlaceholder')"
      clearable
      outlined
      type="number"
      min="0"
      :error-messages="errorMessagesCompliances"
      :rules="[validateSamplingCompliance, validateFullValues]"
    />
  </div>
</template>

<script>
export default {
  name: 'SamplingRecord',
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      errorMessagesTotal: '',
      errorMessagesSize: '',
      errorMessagesCompliances: ''
    }
  },
  computed: {
    isAnyError () {
      if (this.errorMessagesTotal.trim().length > 0) return true
      if (this.errorMessagesSize.trim().length > 0) return true
      if (this.errorMessagesCompliances.trim().length > 0) return true
      return false
    }
  },
  created () {
    if (!this.question.samplingRecord) {
      this.question.samplingRecord = {
        aproximateTotal: '',
        sampleSize: '',
        nonCompliances: ''
      }
    }
  },
  methods: {
    validateSamplingTotal () {
      this.errorMessagesTotal = ''
      if (this.question.samplingRecord.aproximateTotal === '' &&
          this.question.samplingRecord.sampleSize === '' &&
          this.question.samplingRecord.nonCompliances === '') {
        return true
      }
      if (this.question.samplingRecord.aproximateTotal < 1) {
        this.errorMessagesTotal = 'Approximate Total have to be higher than 1'
        return false
      }

      if (this.question.samplingRecord.nonCompliances > 0) {
        if (this.question.samplingRecord.aproximateTotal === '') {
          this.errorMessagesTotal = 'Approximate Total is required'
          return false
        }
      }
      return true
    },
    validateSamplingSize () {
      this.errorMessagesSize = ''
      if (this.question.samplingRecord.aproximateTotal === '' &&
          this.question.samplingRecord.sampleSize === '' &&
          this.question.samplingRecord.nonCompliances === '') {
        return true
      }
      if (this.question.samplingRecord.sampleSize < 1) {
        this.errorMessagesSize = 'Sample Size have to be higher than 1'
        return false
      }

      if (this.question.samplingRecord.nonCompliances > 0) {
        if (this.question.samplingRecord.sampleSize === '') {
          this.errorMessagesSize = 'Sample Size is required'
          return false
        }
      }
      return true
    },
    validateSamplingCompliance () {
      this.errorMessagesCompliances = ''
      if (this.question.samplingRecord.aproximateTotal === '' &&
          this.question.samplingRecord.sampleSize === '' &&
          this.question.samplingRecord.nonCompliances === '') {
        return true
      }
      if (this.question.samplingRecord.nonCompliances < 0) {
        this.errorMessagesCompliances = 'Number of non-compliances have to be 0 or higher'
        return false
      }

      return true
    },
    validateFullValues () {
      if (this.question.samplingRecord.aproximateTotal > 1 && this.question.samplingRecord.sampleSize > 1 && this.question.samplingRecord.nonCompliances > 0) {
        this.errorMessagesTotal = ''
        this.errorMessagesSize = ''
        this.errorMessagesCompliances = ''
        if (this.question.samplingRecord.sampleSize > 1 || this.question.samplingRecord.nonCompliances > 0) {
          if (this.question.samplingRecord.aproximateTotal === '') {
            this.errorMessagesTotal = 'Approximate Total is required'
            return false
          }
          if (this.question.samplingRecord.aproximateTotal < this.question.samplingRecord.sampleSize) {
            this.errorMessagesTotal = 'Approximate Total have to be higher than Sample Size'
            return false
          }
        }
        if (this.question.samplingRecord.sampleSize < this.question.samplingRecord.nonCompliances) {
          this.errorMessagesSize = 'Sample size have to be higher than the Number of non-Compliances'
          return false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
